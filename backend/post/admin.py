from django.contrib import admin
from post.models import Post, PostImage

from backend.admin import BaseModelAdmin

admin.site.register(Post, BaseModelAdmin)
admin.site.register(PostImage, BaseModelAdmin)
