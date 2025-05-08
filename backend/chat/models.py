import uuid

from django.core.exceptions import ValidationError
from django.db import models
from djauth.models import User


class Conversation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    participants = models.ManyToManyField(User)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.id}"


class Message(models.Model):
    MESSAGE_TYPES = [
        ("text", "Text"),
        ("call_started", "Call Started"),
        ("call_ended", "Call Ended"),
        ("missed_call", "Missed Call"),
    ]

    conversation = models.ForeignKey(
        Conversation, on_delete=models.CASCADE, related_name="messages"
    )
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(blank=True)  # optional for call events
    message_type = models.CharField(
        max_length=20, choices=MESSAGE_TYPES, default="text"
    )
    timestamp = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(blank=True, null=True)
