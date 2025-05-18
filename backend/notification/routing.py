from django.urls import path
from notification.consumers import NotificationConsumer

urlpatterns = [
    path(
        "ws/notifications/",
        NotificationConsumer.as_asgi(),
        name="notificationconsumer",
    ),
]
