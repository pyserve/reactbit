from chat.urls import router as ChatRouter
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from djauth.urls import router as AuthRouter
from post.urls import router as PostRouter
from rest_framework.authtoken import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.registry.extend(AuthRouter.registry)
router.registry.extend(PostRouter.registry)
router.registry.extend(ChatRouter.registry)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api-auth/", include("rest_framework.urls")),
    path("", include(router.urls)),
    path("auth/token/", views.obtain_auth_token),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
