from django.db import models
from djauth.models import User


class PostImage(models.Model):
    file = models.ImageField(upload_to="posts/images/")


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_posts")
    caption = models.TextField()
    likes = models.IntegerField(default=0)
    images = models.ManyToManyField(PostImage, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now=True)
