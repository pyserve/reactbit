from chat.consumers import ChatConsumer, ConversationConsumber
from django.urls import path

urlpatterns = [
    path("ws/chat/<str:room_id>/", ChatConsumer.as_asgi(), name="chatconsumer"),
    path(
        "ws/conversation/<str:user_id>/",
        ConversationConsumber.as_asgi(),
        name="conversationconsumer",
    ),
]
