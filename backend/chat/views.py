from chat.models import Conversation, Message
from chat.serializers import ConversationSerializer, MessageSerializer
from django.db.models import DateTimeField, OuterRef, Subquery
from django.db.models.functions import Coalesce
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.viewsets import ModelViewSet


class ConversationViewset(ModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Conversation.objects.none()
        latest_message = (
            Message.objects.filter(conversation=OuterRef("pk"))
            .order_by("-timestamp")
            .values("timestamp")[:1]
        )

        return (
            Conversation.objects.filter(participants=user)
            .annotate(
                last_message_time=Subquery(latest_message, output_field=DateTimeField())
            )
            .order_by(Coalesce("last_message_time", "created_at").desc())
        )


class MessageViewset(ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ["conversation"]
