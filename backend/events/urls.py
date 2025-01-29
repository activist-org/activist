# SPDX-License-Identifier: AGPL-3.0-or-later
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from events.views import EventSocialLinkViewSet, EventTextViewSet, EventViewSet

app_name = "events"

router = DefaultRouter()

# MARK: Main Tables

router.register(prefix=r"events", viewset=EventViewSet, basename="events")

# MARK: Bridge Tables

router.register(
    prefix=r"event_social_links",
    viewset=EventSocialLinkViewSet,
    basename="event-social-links",
)
router.register(prefix=r"event_texts", viewset=EventTextViewSet, basename="event-text")

urlpatterns = [
    path("", include(router.urls)),
]
