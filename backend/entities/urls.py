from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = "entities"

router = DefaultRouter()

# MARK: Main Tables

router.register(prefix=r"groups", viewset=views.GroupViewSet)
router.register(
    prefix=r"organizations", viewset=views.OrganizationViewSet, basename="organization"
)
router.register(prefix=r"statuses", viewset=views.StatusViewSet)

# MARK: Bridge Tables

router.register(prefix=r"group_events", viewset=views.GroupEventViewSet)
router.register(prefix=r"group_faqs", viewset=views.GroupFaqViewSet)
router.register(prefix=r"group_images", viewset=views.GroupImageViewSet)
router.register(prefix=r"group_members", viewset=views.GroupMemberViewSet)
router.register(prefix=r"group_resources", viewset=views.GroupResourceViewSet)
router.register(prefix=r"group_social_links", viewset=views.GroupSocialLinkViewSet)
router.register(prefix=r"group_texts", viewset=views.GroupTextViewSet)
router.register(prefix=r"group_topics", viewset=views.GroupTopicViewSet)

router.register(
    prefix=r"organization_applications", viewset=views.OrganizationApplicationViewSet
)
router.register(
    prefix=r"organization_discussions", viewset=views.OrganizationDiscussionViewSet
)
router.register(prefix=r"organization_events", viewset=views.OrganizationEventViewSet)
router.register(prefix=r"organization_faqs", viewset=views.OrganizationFaqViewSet)
router.register(prefix=r"organization_groups", viewset=views.OrganizationGroupViewSet)
router.register(prefix=r"organization_images", viewset=views.OrganizationImageViewSet)
router.register(prefix=r"organization_members", viewset=views.OrganizationMemberViewSet)
router.register(
    prefix=r"organization_resources", viewset=views.OrganizationResourceViewSet
)
router.register(
    prefix=r"organization_social_links", viewset=views.OrganizationSocialLinkViewSet
)
router.register(prefix=r"organization_tasks", viewset=views.OrganizationTaskViewSet)
router.register(prefix=r"organization_texts", viewset=views.OrganizationTextViewSet)
router.register(prefix=r"organization_topics", viewset=views.OrganizationTopicViewSet)

router.register(prefix=r"status_types", viewset=views.StatusTypeViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
