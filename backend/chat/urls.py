from chat import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("conversations", views.ConversationViewset)
router.register("messages", views.MessageViewset)
