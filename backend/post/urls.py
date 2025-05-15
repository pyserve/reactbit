from post import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("posts", views.PostViewSet)
router.register("post_images", views.PostImageViewSet)
router.register("post_reactions", views.PostReactionViewSet)
router.register("post_comments", views.PostCommentViewSet)
router.register("saved_posts", views.SavedPostViewSet)
router.register("shared_posts", views.SharedPostViewSet)
