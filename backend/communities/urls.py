# SPDX-License-Identifier: AGPL-3.0-or-later
"""
URL configuration for the communities app.
"""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from communities.groups.views import (
    GroupAPIView,
    GroupDetailAPIView,
    GroupFaqViewSet,
    GroupFlagAPIView,
    GroupFlagDetailAPIView,
    GroupImageViewSet,
    GroupResourceViewSet,
    GroupSocialLinkViewSet,
    GroupTextViewSet,
)
from communities.organizations.views import (
    OrganizationAPIView,
    OrganizationDetailAPIView,
    OrganizationFaqViewSet,
    OrganizationFlagAPIView,
    OrganizationFlagDetailAPIView,
    OrganizationImageViewSet,
    OrganizationResourceViewSet,
    OrganizationSocialLinkViewSet,
    OrganizationTextViewSet,
)
from communities.views import StatusViewSet

app_name = "communities"

router = DefaultRouter(trailing_slash=False)

router.register(
    prefix=r"statuses",
    viewset=StatusViewSet,
)

# MARK: Group

router.register(
    prefix=r"group/(?P<group_id>[^/.]+)/images",
    viewset=GroupImageViewSet,
    basename="group-images",
)
router.register(
    prefix=r"group_faqs",
    viewset=GroupFaqViewSet,
    basename="group-faqs",
)
router.register(
    prefix=r"group_resources",
    viewset=GroupResourceViewSet,
    basename="group-resources",
)
router.register(
    prefix=r"group_social_links",
    viewset=GroupSocialLinkViewSet,
    basename="group-social-links",
)

# MARK: Organization

router.register(
    prefix=r"organization_faqs",
    viewset=OrganizationFaqViewSet,
    basename="organization-faqs",
)
router.register(
    prefix=r"organization_resources",
    viewset=OrganizationResourceViewSet,
    basename="organization-resources",
)
router.register(
    prefix=r"organization_social_links",
    viewset=OrganizationSocialLinkViewSet,
    basename="organization-social-links",
)
router.register(
    prefix=r"organization/(?P<org_id>[^/.]+)/images",
    viewset=OrganizationImageViewSet,
    basename="organization-images",
)

# MARK: URL Patterns

urlpatterns = [
    path("", include(router.urls)),
    path("groups", GroupAPIView.as_view()),
    path("groups/<uuid:id>", GroupDetailAPIView.as_view()),
    path("group_flags", GroupFlagAPIView.as_view()),
    path("group_flags/<uuid:id>", GroupFlagDetailAPIView.as_view()),
    path("group_texts/<uuid:id>", GroupTextViewSet.as_view()),
    path("organizations", OrganizationAPIView.as_view()),
    path("organizations/<uuid:id>", OrganizationDetailAPIView.as_view()),
    path("organization_flags", OrganizationFlagAPIView.as_view()),
    path(
        "organization_flags/<uuid:id>",
        OrganizationFlagDetailAPIView.as_view(),
    ),
    path("organization_texts/<uuid:id>", OrganizationTextViewSet.as_view()),
]
