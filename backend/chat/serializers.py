from chat.models import Conversation, Message
from django.db.models import Count
from djauth.models import User
from djauth.serializers import UserSerializer
from rest_framework.serializers import ModelSerializer


class MessageSerializer(ModelSerializer):
    sender = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = "__all__"

    def create(self, validated_data):
        return super().create(validated_data)


class ConversationSerializer(ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = "__all__"

    def create(self, validated_data):
        request = self.context.get("request", None)
        participant_ids = sorted(request.data.get("participants", []))
        possible_conversations = (
            Conversation.objects.filter(participants__in=participant_ids)
            .annotate(count=Count("participants"))
            .filter(count=len(participant_ids))
        ).distinct()

        for convo in possible_conversations:
            existing_ids = set(convo.participants.values_list("id", flat=True))
            if set(participant_ids) == existing_ids:
                return convo

        validated_data["participants"] = participant_ids
        instance = super(ConversationSerializer, self).create(validated_data)
        return instance
