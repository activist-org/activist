from apps.users.views import UserViewSet
from rest_framework import routers

# Settings
api = routers.DefaultRouter()
api.trailing_slash = "/?"

# Users API
api.register(r"users", UserViewSet)
