import uuid
from datetime import timedelta

from django.conf import settings
from django.contrib.auth.models import AbstractUser, Permission
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    display_name = models.CharField(max_length=100, null=True, blank=True)
    dob = models.DateField(blank=True, null=True)
    image = models.FileField(upload_to="profiles/", null=True, blank=True)
    cover = models.FileField(upload_to="covers/", null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    website = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    groups = models.ManyToManyField(
        "auth.Group",
        related_name="custom_user_groups",
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="custom_user_permissions",
        blank=True,
    )
    followers = models.ManyToManyField(
        "self",
        symmetrical=False,
        related_name="following",
        blank=True,
    )

    def get_mutual_follow(self):
        following = self.following.all()
        users = (
            User.objects.filter(followers__in=following)
            .exclude(id=self.id)
            .exclude(id__in=following)
            .distinct()
        )
        return users

    def get_friends_of_friends(self):
        following = self.following.all()
        return (
            User.objects.filter(followers__in=following)
            .exclude(id__in=following.values_list("id", flat=True))
            .exclude(id=self.id)
            .distinct()
        )

    def get_suggestions(self):
        following = self.following.all()
        followers = self.followers.all()

        return (
            User.objects.exclude(id__in=following.values_list("id", flat=True))
            .exclude(id__in=followers.values_list("id", flat=True))
            .exclude(id=self.id)
        )

    def save(self, *args, **kwargs):
        self.display_name = f"{self.first_name} {self.last_name}".strip()
        super().save(*args, **kwargs)


class Group(models.Model):
    name = models.CharField(max_length=150, unique=True)
    permissions = models.ManyToManyField(
        Permission, blank=True, related_name="custom_groups"
    )
    users = models.ManyToManyField(
        settings.AUTH_USER_MODEL, blank=True, related_name="custom_groups"
    )

    def __str__(self):
        return self.name

    def has_permission(self, perm_codename: str) -> bool:
        """Check if any user in the group has a specific permission"""
        return self.permissions.filter(codename=perm_codename).exists()


class PasswordResetToken(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="reset_tokens"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=timezone.now() + timedelta(days=3))

    def is_expired(self):
        return timezone.now() > self.expires_at
