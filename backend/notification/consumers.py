import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.contenttypes.models import ContentType
from djauth.models import User
from notification.models import Notification


@database_sync_to_async
def create_notification(data):
    recipient = data.get("recipient", None)
    sender = data.get("sender", None)
    model = data.get("model", None)
    record_id = data.get("record_id", None)
    message = data.get("message", None)
    notification_type = data.get("notification_type", None)
    recipient_user = User.objects.get(id=recipient)
    sender_user = User.objects.get(id=sender)
    content_type = ContentType.objects.filter(model=model).first()
    if content_type:
        return Notification.objects.create(
            recipient=recipient_user,
            sender=sender_user,
            content_type=content_type,
            object_id=record_id,
            notification_type=notification_type,
            message=message,
        )
    return None


@database_sync_to_async
def read_message_notifications(recipient, sender):
    notifications = Notification.objects.filter(
        recipient_id=recipient,
        sender_id=sender,
        is_read=False,
        notification_type="message",
    )
    for n in notifications:
        n.is_read = True
        n.save()


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope.get("user")
        if user and user.is_authenticated:
            self.user = self.scope["user"]
            self.group_name = f"user_{self.user.id}_notifications"
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        recipient = data.get("recipient", None)
        deleted = data.get("deleted", None)
        if recipient:
            await self.channel_layer.group_send(
                f"user_{recipient}_notifications",
                {"type": "send_notification", "data": data},
            )

        if deleted:
            await self.channel_layer.group_send(
                f"user_{deleted}_notifications",
                {"type": "deleted_notification", "data": data},
            )

    async def send_notification(self, event):
        data = event["data"]
        notify = await create_notification(data)
        await self.send(
            text_data=json.dumps(
                {
                    "notification": notify.id,
                }
            )
        )

    async def deleted_notification(self, event):
        await self.send(text_data=json.dumps({"notification": event["data"]}))

    async def read_all_message_notification(self, event):
        recipient = event["recipient"]
        sender = event["sender"]

        await read_message_notifications(recipient, sender)
        await self.send(
            text_data=json.dumps(
                {
                    "read_all_notifications": True,
                }
            )
        )
