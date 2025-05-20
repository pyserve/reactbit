import os

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")

django_asgi_app = get_asgi_application()

from chat.middleware import TokenAuthMiddleware
from chat.routing import urlpatterns as chaturls
from notification.routing import urlpatterns as notificationurls

websocket_urlpatterns = chaturls + notificationurls


application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": TokenAuthMiddleware(URLRouter(websocket_urlpatterns)),
    }
)
