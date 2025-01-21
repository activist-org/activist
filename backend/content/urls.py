# SPDX-License-Identifier: AGPL-3.0-or-later
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from content import views

app_name = "content"

router = DefaultRouter()

# MARK: Main Tables

router.register(prefix=r"discussions", viewset=views.DiscussionViewSet)
router.register(prefix=r"resources", viewset=views.ResourceViewSet)

# MARK: Bridge Tables

router.register(prefix=r"discussion_entries", viewset=views.DiscussionEntryViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
