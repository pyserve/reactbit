from django.conf import settings
from djauth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    mutual_follows = serializers.SerializerMethodField()
    suggestions = serializers.SerializerMethodField()
    following = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = "__all__"

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def get_following(self, obj):
        return list(obj.following.values_list("id", flat=True))

    def get_mutual_follows(self, obj):
        mutual_users = obj.get_mutual_follow()
        return [user.id for user in mutual_users]

    def get_suggestions(self, obj):
        suggested_users = obj.get_suggestions()
        return [user.id for user in suggested_users]


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email not registered.")
        return value
