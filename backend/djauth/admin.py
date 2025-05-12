from django.contrib import admin
from django.contrib.auth.models import Group as DjangoGroup
from djauth.models import Group, PasswordResetToken, User

from backend.admin import BaseModelAdmin

admin.site.register(User, BaseModelAdmin)
admin.site.register(Group, BaseModelAdmin)
admin.site.register(PasswordResetToken, BaseModelAdmin)
admin.site.unregister(DjangoGroup)
