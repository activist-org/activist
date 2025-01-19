# SPDX-License-Identifier: AGPL-3.0-or-later
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from communities.groups.views import GroupTextViewSet, GroupViewSet
from communities.organizations.views import OrganizationTextViewSet, OrganizationViewSet
from communities.views import StatusViewSet

app_name = "communities"

router = DefaultRouter()

# MARK: Main Tables

router.register(prefix=r"groups", viewset=GroupViewSet, basename="group")
router.register(
    prefix=r"group_texts",
    viewset=GroupTextViewSet,
    basename="group-text",
)
router.register(
    prefix=r"organizations", viewset=OrganizationViewSet, basename="organization"
)
router.register(
    prefix=r"organization_texts",
    viewset=OrganizationTextViewSet,
    basename="organization-text",
)
router.register(prefix=r"statuses", viewset=StatusViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
