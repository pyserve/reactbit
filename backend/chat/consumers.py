import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from chat.models import Conversation, Message
from djauth.serializers import UserSerializer


@database_sync_to_async
def get_user_data(user):
    return UserSerializer(user).data


@database_sync_to_async
def get_conversation_participants(conversation_id):
    conversation = Conversation.objects.get(id=conversation_id)
    participants = list(conversation.participants.values_list("id", flat=True))
    return participants


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.conversation_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.user = self.scope["user"]
        self.group_name = f"chat_{self.conversation_id}"

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get("message")
        typing = data.get("typing")

        if message:
            user_info = await get_user_data(self.user)
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "chat_message",
                    "message": message,
                    "sender": user_info,
                },
            )
            participants = await get_conversation_participants(self.conversation_id)
            for user in participants:
                await self.channel_layer.group_send(
                    f"user_{user}", {"type": "conversation_update", "data": data}
                )

        if typing is not None:
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "user_typing",
                    "typing": typing,
                    "user": await get_user_data(self.user),
                },
            )

    async def chat_message(self, event):
        sender = event["sender"]
        message = event["message"]
        await self.save_message(self.user, sender, message)
        await self.send(
            text_data=json.dumps(
                {
                    "message": message,
                    "sender": sender,
                }
            )
        )

    async def user_typing(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "typing": event["typing"],
                    "user": event["user"],
                }
            )
        )

    @database_sync_to_async
    def save_message(self, user, sender, message):
        if sender.get("id", None) == user.id:
            conversation = Conversation.objects.get(id=self.conversation_id)
            Message.objects.create(
                conversation=conversation, sender=user, content=message
            )


class ConversationConsumber(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope["url_route"]["kwargs"]["user_id"]
        self.group_name = f"user_{self.user_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "conversation_update",
                "data": data,
            },
        )

    async def conversation_update(self, event):
        await self.send(text_data=json.dumps({"data": event["data"]}))
