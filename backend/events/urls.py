from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = "events"

router = DefaultRouter()

# MARK: Main Tables

router.register(prefix=r"events", viewset=views.EventViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
