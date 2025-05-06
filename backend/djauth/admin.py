from django.contrib import admin
from django.contrib.auth.models import Group as DjangoGroup
from djauth.models import Group, User

admin.site.register(User)
admin.site.register(Group)
admin.site.unregister(DjangoGroup)
