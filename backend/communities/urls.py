# SPDX-License-Identifier: AGPL-3.0-or-later
"""
URL configuration for the communities app.
"""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from communities.groups.views import (
    GroupAPIView,
    GroupDetailAPIView,
    GroupEventsCalenderAPIView,
    GroupFaqViewSet,
    GroupFlagAPIView,
    GroupFlagDetailAPIView,
    GroupImageViewSet,
    GroupSocialLinkViewSet,
    GroupTextViewSet,
)
from communities.organizations.views import (
    OrganizationAPIView,
    OrganizationDetailAPIView,
    OrganizationEventsCalenderAPIView,
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

router.register(
    prefix=r"statuses",
    viewset=StatusViewSet,
)
router.register(
    prefix=r"group_faqs",
    viewset=GroupFaqViewSet,
    basename="group-faqs",
)
router.register(
    prefix=r"group_social_links",
    viewset=GroupSocialLinkViewSet,
    basename="group-social-links",
)
router.register(
    prefix=r"organization_faqs",
    viewset=OrganizationFaqViewSet,
    basename="organization-faqs",
)
router.register(
    prefix=r"organization_social_links",
    viewset=OrganizationSocialLinkViewSet,
    basename="organization-social-links",
)
router.register(
    prefix=r"group/(?P<group_id>[^/.]+)/images",
    viewset=GroupImageViewSet,
    basename="group-images",
)
router.register(
    prefix=r"organization/(?P<org_id>[^/.]+)/images",
    viewset=OrganizationImageViewSet,
    basename="organization-images",
)

urlpatterns = [
    path("", include(router.urls)),
    path("groups", GroupAPIView.as_view()),
    path("groups/<uuid:id>", GroupDetailAPIView.as_view()),
    path("group_flag", GroupFlagAPIView.as_view()),
    path("group_flag/<uuid:id>", GroupFlagDetailAPIView.as_view()),
    path("group_texts/<uuid:id>", GroupTextViewSet.as_view()),
    path(
        "groups/<uuid:id>/events/event_calendar", GroupEventsCalenderAPIView.as_view()
    ),
    path("organizations", OrganizationAPIView.as_view()),
    path("organizations/<uuid:id>", OrganizationDetailAPIView.as_view()),
    path("organization_flag", OrganizationFlagAPIView.as_view()),
    path(
        "organization_flag/<uuid:id>",
        OrganizationFlagDetailAPIView.as_view(),
    ),
    path("organization_texts/<uuid:id>", OrganizationTextViewSet.as_view()),
    path(
        "organizations/<uuid:id>/events/event_calendar",
        OrganizationEventsCalenderAPIView.as_view(),
    ),
]
