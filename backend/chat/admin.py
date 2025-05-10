from chat.models import Conversation, Message
from django.contrib import admin

from backend.admin import BaseModelAdmin

admin.site.register(Conversation, BaseModelAdmin)
admin.site.register(Message, BaseModelAdmin)
