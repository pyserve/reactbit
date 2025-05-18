import django_filters

from .models import Notification


class NotificationFilter(django_filters.FilterSet):
    id = django_filters.NumberFilter()
    recipient = django_filters.NumberFilter()
    sender = django_filters.NumberFilter()
    is_read = django_filters.BooleanFilter()
    notification_type = django_filters.CharFilter()

    notification_type__ne = django_filters.CharFilter(
        method="filter_notification_type_ne"
    )
    sender__ne = django_filters.NumberFilter(method="filter_sender_ne")
    recipient__ne = django_filters.NumberFilter(method="filter_recipient_ne")

    def filter_notification_type_ne(self, queryset, name, value):
        return queryset.exclude(notification_type=value)

    def filter_sender_ne(self, queryset, name, value):
        return queryset.exclude(sender=value)

    def filter_recipient_ne(self, queryset, name, value):
        return queryset.exclude(recipient=value)

    class Meta:
        model = Notification
        fields = [
            "id",
            "recipient",
            "sender",
            "is_read",
            "notification_type",
            "notification_type__ne",
            "sender__ne",
            "recipient__ne",
        ]
