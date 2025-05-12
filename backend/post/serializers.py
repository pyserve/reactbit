from djauth.serializers import UserSerializer
from post.models import Post, PostImage
from rest_framework import serializers


class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ["id", "file"]


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = "__all__"
