from djauth.serializers import UserSerializer
from post.models import Post, PostImage
from rest_framework import serializers


class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ["id", "file"]


class PostSerializer(serializers.ModelSerializer):
    images = PostImageSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Post
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        images_data = representation.get("images")
        if images_data:
            for image_data in images_data:
                file_path = image_data.get("file")
                if file_path:
                    image_data["file"] = f"{file_path}"
        return representation
