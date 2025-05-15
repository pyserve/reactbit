from django_filters.rest_framework import DjangoFilterBackend
from post import models, serializers
from post.filters import PostImageFilter
from rest_framework import status
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet


class PostViewSet(ModelViewSet):
    queryset = models.Post.objects.all()
    serializer_class = serializers.PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ["user"]

    def get_queryset(self):
        return super().get_queryset().order_by("-created_at")


class PostImageViewSet(ModelViewSet):
    queryset = models.PostImage.objects.all()
    serializer_class = serializers.PostImageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [PostImageFilter]


class PostReactionViewSet(ModelViewSet):
    queryset = models.PostReaction.objects.all()
    serializer_class = serializers.PostReactionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ["user", "post"]

    def create(self, request, *args, **kwargs):
        post = request.data.get("post", None)
        user = request.data.get("user", None)

        if not post or not user:
            return Response(
                {"detail": "Post and user are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        reaction = models.PostReaction.objects.filter(post=post, user=user).first()
        if reaction:
            reaction.delete()
            return Response({"detail": "Reaction removed."}, status=status.HTTP_200_OK)

        return super().create(request, *args, **kwargs)


class PostCommentViewSet(ModelViewSet):
    queryset = models.PostComment.objects.all()
    serializer_class = serializers.PostCommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ["user", "post"]


class SavedPostViewSet(ModelViewSet):
    queryset = models.SavedPost.objects.all()
    serializer_class = serializers.SavedPostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ["user", "post"]

    def create(self, request, *args, **kwargs):
        post = request.data.get("post", None)
        user = request.data.get("user", None)

        if not post or not user:
            return Response(
                {"detail": "Post and user are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        saved_post = models.SavedPost.objects.filter(post=post, user=user).first()
        if saved_post:
            saved_post.delete()
            return Response({"detail": "Post unsaved."}, status=status.HTTP_200_OK)

        return super().create(request, *args, **kwargs)


class SharedPostViewSet(ModelViewSet):
    queryset = models.SharedPost.objects.all()
    serializer_class = serializers.SharedPostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ["user", "original_post"]

    def create(self, request, *args, **kwargs):
        original_post = request.data.get("original_post", None)
        user = request.data.get("user", None)

        if not original_post or not user:
            return Response(
                {"detail": "Post and user are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        shared_post = models.SharedPost.objects.filter(
            original_post=original_post, user=user
        ).first()
        if shared_post:
            shared_post.delete()
            return Response({"detail": "Post unshared."}, status=status.HTTP_200_OK)

        return super().create(request, *args, **kwargs)
