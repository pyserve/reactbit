from django.contrib import admin
from post import models

from backend.admin import BaseModelAdmin

admin.site.register(models.Post, BaseModelAdmin)
admin.site.register(models.PostImage, BaseModelAdmin)
admin.site.register(models.PostReaction, BaseModelAdmin)
admin.site.register(models.PostComment, BaseModelAdmin)
admin.site.register(models.SavedPost, BaseModelAdmin)
admin.site.register(models.SharedPost, BaseModelAdmin)
