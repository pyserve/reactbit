from django.conf import settings
from django.contrib.auth.models import AbstractUser, Permission
from django.db import models


class User(AbstractUser):
    display_name = models.CharField(max_length=100)
    dob = models.DateField(blank=True, null=True)
    image = models.FileField(upload_to="profiles/", null=True, blank=True)
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
