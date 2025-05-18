from django.contrib import admin
from notification.models import Notification

from backend.admin import BaseModelAdmin

admin.site.register(Notification, BaseModelAdmin)
