# SPDX-License-Identifier: AGPL-3.0-or-later
"""
URL routing for the events app.
"""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from events.views import (
    EventAPIView,
    EventDetailAPIView,
    EventSocialLinkViewSet,
    EventTextViewSet,
)

app_name = "events"
router = DefaultRouter()

# MARK: Bridge Tables

router.register(
    prefix=r"event_social_links",
    viewset=EventSocialLinkViewSet,
    basename="event-social-links",
)
router.register(prefix=r"event_texts", viewset=EventTextViewSet, basename="event-text")

urlpatterns = [
    path("", include(router.urls)),
    path("events/", EventAPIView.as_view()),
    path("events/<uuid:id>/", EventDetailAPIView.as_view()),
]
