from django.contrib import admin
from django.urls import include, path
from djauth.urls import router as AuthRouter
from rest_framework.authtoken import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.registry.extend(AuthRouter.registry)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api-auth/", include("rest_framework.urls")),
    path("", include(router.urls)),
    path("auth/token/", views.obtain_auth_token),
]
