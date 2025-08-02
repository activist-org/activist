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
    OrganizationSocialLinkViewSet,
    OrganizationTextViewSet,
)
from communities.views import StatusViewSet

app_name = "communities"

router = DefaultRouter(trailing_slash=False)

# MARK: Main Tables

router.register(prefix=r"statuses", viewset=StatusViewSet)

# MARK: Bridge Tables

# router.register(
#     prefix=r"group_social_links",
#     viewset=GroupSocialLinkViewSet,
#     basename="group-social-links",
# )
router.register(
    prefix=r"group_faqs",
    viewset=GroupFaqViewSet,
    basename="group-faqs",
)
router.register(
    prefix=r"group_texts",
    viewset=GroupTextViewSet,
    basename="group-text",
)
router.register(
    prefix=r"organization_faqs",
    viewset=OrganizationFaqViewSet,
    basename="organization-faqs",
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
    path("groups", GroupAPIView.as_view()),
    path("groups/<uuid:id>", GroupDetailAPIView.as_view()),
    path("organizations", OrganizationAPIView.as_view()),
    path("organizations/<uuid:id>", OrganizationDetailAPIView.as_view()),
    path("group_flag", GroupFlagAPIView.as_view()),
    path("group_flag/<uuid:id>", GroupFlagDetailAPIView.as_view()),
    path("organization_flag", OrganizationFlagAPIView.as_view()),
    path(
        "organization_flag/<uuid:id>",
        OrganizationFlagDetailAPIView.as_view(),
    ),
    path("group_social_links/<uuid:id>", GroupSocialLinkViewSet.as_view()),
    path(
        "organization_social_links/<uuid:id>", OrganizationSocialLinkViewSet.as_view()
    ),
]
