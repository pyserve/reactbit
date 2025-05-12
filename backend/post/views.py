from django_filters.rest_framework import DjangoFilterBackend
from post.filters import PostImageFilter
from post.models import Post, PostImage
from post.serializers import PostImageSerializer, PostSerializer
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.viewsets import ModelViewSet


class PostViewSet(ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ["user"]

    def get_queryset(self):
        return super().get_queryset().order_by("-created_at")


class PostImageViewSet(ModelViewSet):
    queryset = PostImage.objects.all()
    serializer_class = PostImageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [PostImageFilter]
