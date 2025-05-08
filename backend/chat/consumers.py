import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from djauth.serializers import UserSerializer


@database_sync_to_async
def get_user_data(user):
    return UserSerializer(user).data


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
        await self.send(
            text_data=json.dumps(
                {
                    "message": event["message"],
                    "sender": event["sender"],
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
