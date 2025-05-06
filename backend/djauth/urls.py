from djauth.views import GroupViewSet, UserViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("users", UserViewSet, basename="users")
router.register("groups", GroupViewSet, basename="groups")
