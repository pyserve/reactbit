from djauth.serializers import UserSerializer
from notification.models import Notification
from rest_framework import serializers


class NotificationSerializer(serializers.ModelSerializer):
    recipient = UserSerializer(read_only=True)
    sender = UserSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = "__all__"
