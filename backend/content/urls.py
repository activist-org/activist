# SPDX-License-Identifier: AGPL-3.0-or-later
"""
URL configuration for the content app.
"""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from content import views

app_name = "content"

router = DefaultRouter(trailing_slash=False)

router.register(
    prefix=r"discussions",
    viewset=views.DiscussionViewSet,
)
router.register(
    prefix=r"discussion_entries",
    viewset=views.DiscussionEntryViewSet,
)
router.register(
    prefix=r"resources",
    viewset=views.ResourceViewSet,
)
router.register(
    prefix=r"images",
    viewset=views.ImageViewSet,
)
router.register(
    prefix=r"image_icon",
    viewset=views.ImageIconViewSet,
    basename="image_icon",
)

urlpatterns = [
    path("", include(router.urls)),
    path("resource_flags", view=views.ResourceFlagAPIView.as_view()),
    path(
        "resource_flags/<uuid:id>",
        view=views.ResourceFlagDetailAPIView.as_view(),
    ),
]
