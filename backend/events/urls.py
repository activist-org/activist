# SPDX-License-Identifier: AGPL-3.0-or-later
"""
URL configuration for the events app.
"""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from events.views import (
    EventAPIView,
    EventCalendarAPIView,
    EventDetailAPIView,
    EventFaqViewSet,
    EventFlagAPIView,
    EventFlagDetailAPIView,
    EventResourceViewSet,
    EventSocialLinkViewSet,
    EventSupportFromOrgAPIView,
    EventSupportFromOrgDetailAPIView,
    EventSupportFromUserAPIView,
    EventSupportFromUserDetailAPIView,
    EventTextViewSet,
)

app_name = "events"
router = DefaultRouter(trailing_slash=False)

router.register(
    prefix=r"event_faqs",
    viewset=EventFaqViewSet,
    basename="event-faqs",
)
router.register(
    prefix=r"event_resources",
    viewset=EventResourceViewSet,
    basename="event-resources",
)
router.register(
    prefix=r"event_social_links",
    viewset=EventSocialLinkViewSet,
    basename="event-social-links",
)
router.register(
    prefix=r"event_support_from_user",
    viewset=EventSupportFromUserDetailAPIView,
    basename="event-support-from-user",
)

urlpatterns = [
    path("", include(router.urls)),
    path("events", EventAPIView.as_view()),
    path("events/<uuid:id>", EventDetailAPIView.as_view()),
    path("event_flags", EventFlagAPIView.as_view()),
    path("event_flags/<uuid:id>", EventFlagDetailAPIView.as_view()),
    path("event_calendar", EventCalendarAPIView.as_view()),
    path("event_texts/<uuid:id>", EventTextViewSet.as_view()),
    path("event_support_from_user", EventSupportFromUserAPIView.as_view()),
    path(
        "event_support_from_orgs/<uuid:id>/<uuid:org>",
        EventSupportFromOrgDetailAPIView.as_view(),
    ),
    path(
        "event_support_from_orgs/<uuid:id>",
        EventSupportFromOrgAPIView.as_view(),
    ),
]
