# SPDX-License-Identifier: AGPL-3.0-or-later
"""
URL configuration for the events app.
"""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from events.views import (
    EventAPIView,
    EventCalenderAPIView,
    EventCalenderDetailAPIView,
    EventDetailAPIView,
    EventFaqViewSet,
    EventFlagAPIView,
    EventFlagDetailAPIView,
    EventSocialLinkViewSet,
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
    prefix=r"event_social_links",
    viewset=EventSocialLinkViewSet,
    basename="event-social-links",
)

urlpatterns = [
    path("", include(router.urls)),
    path("events", EventAPIView.as_view()),
    path("events/<uuid:id>", EventDetailAPIView.as_view()),
    path("event_flag", EventFlagAPIView.as_view()),
    path("event_flag/<uuid:id>", EventFlagDetailAPIView.as_view()),
    path("events/event_calendar", EventCalenderAPIView.as_view()),
    path("events/<uuid:id>/event_calendar", EventCalenderDetailAPIView.as_view()),
    path("event_texts/<uuid:id>", EventTextViewSet.as_view()),
]
