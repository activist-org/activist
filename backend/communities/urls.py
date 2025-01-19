# SPDX-License-Identifier: AGPL-3.0-or-later
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from communities.groups.views import GroupTextViewSet, GroupViewSet
from communities.organizations.views import (
    OrganizationSocialLinkViewSet,
    OrganizationTextViewSet,
    OrganizationViewSet,
)
from communities.views import StatusViewSet

# from content import views

app_name = "communities"

router = DefaultRouter()

# MARK: Main Tables

router.register(prefix=r"groups", viewset=GroupViewSet, basename="group")
router.register(
    prefix=r"group_texts",
    viewset=GroupTextViewSet,
    basename="group-text",
)
router.register(
    prefix=r"organizations", viewset=OrganizationViewSet, basename="organization"
)
router.register(
    prefix=r"organization_texts",
    viewset=OrganizationTextViewSet,
    basename="organization-text",
)
router.register(prefix=r"statuses", viewset=StatusViewSet)

# router.register(prefix=r"social_links", viewset=views.SocialLinkViewSet)
router.register(
    prefix=r"organization_social_links",
    viewset=OrganizationSocialLinkViewSet,
    basename="organization-social-links",
)

urlpatterns = [
    path("", include(router.urls)),
]
