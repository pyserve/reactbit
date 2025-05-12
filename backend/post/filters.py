from rest_framework import filters


class PostImageFilter(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        post_in = request.query_params.get("post__in")
        if post_in:
            id_list = [int(pk) for pk in post_in.split(",") if pk.isdigit()]
            return queryset.filter(post__id__in=id_list).distinct()
        return queryset
