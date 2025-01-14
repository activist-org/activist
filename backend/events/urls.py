# SPDX-License-Identifier: AGPL-3.0-or-later
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from events import views

app_name = "events"

router = DefaultRouter()

# MARK: Main Tables

router.register(prefix=r"events", viewset=views.EventViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
