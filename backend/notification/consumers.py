import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.contenttypes.models import ContentType
from djauth.models import User
from notification.models import Notification


@database_sync_to_async
def create_notification(data):
    post_user_id = data.get("post_user", None)
    user_id = data.get("user", None)
    post = data.get("post", None)
    user = User.objects.get(id=user_id)
    post_user = User.objects.get(id=post_user_id)
    content_type = ContentType.objects.get_for_id(1)
    return Notification.objects.create(
        recipient=post_user,
        sender=user,
        content_type=content_type,
        object_id=1,
        notification_type="like",
        message=f"{user.username} liked your post {post}",
    )


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
        post_user = data.get("post_user", None)
        if post_user:
            await self.channel_layer.group_send(
                f"user_{post_user}_notifications",
                {"type": "send_notification", "data": data},
            )

    async def send_notification(self, event):
        data = event["data"]
        user = data.get("user", None)
        if user:
            notify = await create_notification(data)
            await self.send(
                text_data=json.dumps(
                    {
                        "notification": notify.id,
                    }
                )
            )
        await self.send(
            text_data=json.dumps(
                {
                    "data": data,
                }
            )
        )
