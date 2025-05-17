# SPDX-License-Identifier: AGPL-3.0-or-later
"""
URL configuration for the content app.
"""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from content import views

app_name = "content"

router = DefaultRouter()

# MARK: Main Tables

router.register(prefix=r"discussions", viewset=views.DiscussionViewSet)
router.register(prefix=r"resources", viewset=views.ResourceViewSet)
router.register(prefix=r"images", viewset=views.ImageViewSet)

# MARK: Bridge Tables

router.register(prefix=r"discussion_entries", viewset=views.DiscussionEntryViewSet)
router.register(
    prefix=r"flag_entity", viewset=views.FlagEntityViewSet, basename="FlagEntity"
)

urlpatterns = [
    path("", include(router.urls)),
]
