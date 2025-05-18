import os

from channels.routing import ProtocolTypeRouter, URLRouter
from chat.middleware import TokenAuthMiddleware
from chat.routing import urlpatterns as chaturls
from django.core.asgi import get_asgi_application
from notification.routing import urlpatterns as notificationurls

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")

websocket_urlpatterns = chaturls + notificationurls
application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": TokenAuthMiddleware(URLRouter(websocket_urlpatterns)),
    }
)
