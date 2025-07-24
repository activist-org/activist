# SPDX-License-Identifier: AGPL-3.0-or-later
"""
URL configuration for the content app.
"""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from content import views

app_name = "content"

router = DefaultRouter(trailing_slash=False)

# MARK: Main Tables

router.register(prefix=r"discussions", viewset=views.DiscussionViewSet)
router.register(prefix=r"resources", viewset=views.ResourceViewSet)
router.register(prefix=r"images", viewset=views.ImageViewSet)

# MARK: Bridge Tables

router.register(prefix=r"discussion_entries", viewset=views.DiscussionEntryViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("resource_flag", view=views.ResourceFlagAPIView.as_view()),
    path(
        "resource_flag/<uuid:id>",
        view=views.ResourceFlagDetailAPIView.as_view(),
    ),
]
