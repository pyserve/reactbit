from django_filters import rest_framework as filters
from post.models import Post
from rest_framework.filters import BaseFilterBackend


class PostImageFilter(BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        post_in = request.query_params.get("post__in")
        if post_in:
            id_list = [int(pk) for pk in post_in.split(",") if pk.isdigit()]
            return queryset.filter(post__id__in=id_list).distinct()
        return queryset


class NumberInFilter(filters.BaseInFilter, filters.NumberFilter):
    pass


class PostFilter(filters.FilterSet):
    user__in = NumberInFilter(field_name="user__id", lookup_expr="in")
    user = filters.NumberFilter(field_name="user")
    original_post = filters.NumberFilter(field_name="original_post")

    class Meta:
        model = Post
        fields = ["id", "user", "original_post", "user__in"]
