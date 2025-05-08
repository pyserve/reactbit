from chat.consumers import ChatConsumer
from django.urls import path

urlpatterns = [
    path("ws/chat/<str:room_id>/", ChatConsumer.as_asgi(), name="chatconsumer")
]
