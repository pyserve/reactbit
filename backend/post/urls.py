from post import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("posts", views.PostViewSet)
router.register("post_images", views.PostImageViewSet)
