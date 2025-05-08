# chat/middleware.py
from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework.authtoken.models import Token


class TokenAuthMiddleware:
    """
    Custom middleware to authenticate WebSocket requests based on a token in the URL query parameters.
    """

    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        token = None
        query_string = scope.get("query_string", b"").decode()
        if query_string:
            params = dict(p.split("=") for p in query_string.split("&"))
            token = params.get("token")

        if token:
            user = await self.get_user_from_token(token)
            scope["user"] = user if user else AnonymousUser()
        else:
            scope["user"] = AnonymousUser()

        return await self.inner(scope, receive, send)

    @database_sync_to_async
    def get_user_from_token(self, token):
        try:
            token_obj = Token.objects.get(key=token)
            return token_obj.user
        except Token.DoesNotExist:
            return None
