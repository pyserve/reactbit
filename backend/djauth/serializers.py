from djauth.models import User
from rest_framework.serializers import ModelSerializer, SerializerMethodField


class SimpleUserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "display_name",
            "first_name",
            "last_name",
            "email",
            "username",
            "last_login",
        ]


class UserSerializer(ModelSerializer):
    mutual_follows = SerializerMethodField()
    suggestions = SerializerMethodField()
    followers = SimpleUserSerializer(many=True, read_only=True)
    following = SimpleUserSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = "__all__"

    def get_mutual_follows(self, obj):
        mutual_users = obj.get_mutual_follow()
        return SimpleUserSerializer(mutual_users, many=True).data

    def get_suggestions(self, obj):
        suggested_users = obj.get_suggestions()
        return SimpleUserSerializer(suggested_users, many=True).data


class GroupSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
