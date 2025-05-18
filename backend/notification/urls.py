from notification import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("notifications", views.NotificationViewSet)
