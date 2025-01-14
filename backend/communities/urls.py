# SPDX-License-Identifier: AGPL-3.0-or-later
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from communities.groups.views import GroupViewSet
from communities.organizations.views import OrganizationViewSet
from communities.views import StatusViewSet

app_name = "communities"

router = DefaultRouter()

# MARK: Main Tables

router.register(prefix=r"groups", viewset=GroupViewSet)
router.register(
    prefix=r"organizations", viewset=OrganizationViewSet, basename="organization"
)
router.register(prefix=r"statuses", viewset=StatusViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
