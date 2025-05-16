from post import models
from rest_framework import serializers


class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PostImage
        fields = ["id", "file"]


class PostSerializer(serializers.ModelSerializer):
    images = PostImageSerializer(many=True, read_only=True)

    class Meta:
        model = models.Post
        fields = "__all__"


class PostReactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PostReaction
        fields = "__all__"


class PostCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PostComment
        fields = "__all__"


class SavedPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.SavedPost
        fields = "__all__"
