from chat.urls import router as ChatRouter
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from djauth.urls import router as AuthRouter
from djauth.views import GoogleLogin, PasswordResetConfirm, PasswordResetRequest
from notification.urls import router as NotificationRouter
from post.urls import router as PostRouter
from rest_framework.authtoken import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.registry.extend(AuthRouter.registry)
router.registry.extend(PostRouter.registry)
router.registry.extend(ChatRouter.registry)
router.registry.extend(NotificationRouter.registry)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api-auth/", include("rest_framework.urls")),
    path("", include(router.urls)),
    path("auth/token/", views.obtain_auth_token),
    path(
        "auth/password-reset/",
        PasswordResetRequest.as_view(),
        name="password_reset_request",
    ),
    path(
        "auth/password-reset/confirm/",
        PasswordResetConfirm.as_view(),
        name="password_reset_confirm",
    ),
    path("accounts/", include("allauth.urls")),
    path("dj-rest-auth/", include("dj_rest_auth.urls")),
    path("dj-rest-auth/registration/", include("dj_rest_auth.registration.urls")),
    path("dj-rest-auth/google/", GoogleLogin.as_view(), name="google_login"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
