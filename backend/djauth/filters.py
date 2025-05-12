from django_filters import rest_framework as filters
from djauth.models import User


class NumberInFilter(filters.BaseInFilter, filters.NumberFilter):
    pass


class UserFilter(filters.FilterSet):
    id__in = NumberInFilter(field_name="id", lookup_expr="in")
    username = filters.CharFilter(lookup_expr="icontains")
    email = filters.CharFilter(lookup_expr="icontains")

    class Meta:
        model = User
        fields = ["username", "email", "id", "id__in"]
