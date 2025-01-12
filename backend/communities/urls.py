# SPDX-License-Identifier: AGPL-3.0-or-later
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = "communities"

router = DefaultRouter()

# MARK: Main Tables

router.register(prefix=r"groups", viewset=views.GroupViewSet)
router.register(
    prefix=r"organizations", viewset=views.OrganizationViewSet, basename="organization"
)
router.register(prefix=r"statuses", viewset=views.StatusViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
