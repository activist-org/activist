# SPDX-License-Identifier: AGPL-3.0-or-later
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from communities.groups.views import (
    GroupDetailAPIView,
    GroupListAPIView,
    GroupSocialLinkViewSet,
    GroupTextViewSet,
)
from communities.organizations.views import (
    OrganizationImageViewSet,
    OrganizationSocialLinkViewSet,
    OrganizationTextViewSet,
    OrganizationViewSet,
)
from communities.views import StatusViewSet

app_name = "communities"

router = DefaultRouter()

# MARK: Main Tables

router.register(
    prefix=r"organizations", viewset=OrganizationViewSet, basename="organization"
)
router.register(prefix=r"statuses", viewset=StatusViewSet)

# MARK: Bridge Tables

router.register(
    prefix=r"group_social_links",
    viewset=GroupSocialLinkViewSet,
    basename="group-social-links",
)
router.register(
    prefix=r"group_texts",
    viewset=GroupTextViewSet,
    basename="group-text",
)
router.register(
    prefix=r"organization_social_links",
    viewset=OrganizationSocialLinkViewSet,
    basename="organization-social-links",
)
router.register(
    prefix=r"organization_texts",
    viewset=OrganizationTextViewSet,
    basename="organization-text",
)
router.register(
    prefix=r"organizations/(?P<org_id>[^/.]+)/images",
    viewset=OrganizationImageViewSet,
    basename="organization-images",
)

urlpatterns = [
    path("", include(router.urls)),
    path("groups/", GroupListAPIView.as_view()),
    path("groups/<uuid:id>/", GroupDetailAPIView.as_view()),
]
