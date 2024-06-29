from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = "entities"

router = DefaultRouter()

# MARK: Main Tables

router.register(r"groups", views.GroupViewSet)
router.register(r"organizations", views.OrganizationViewSet, basename="organization")
router.register(r"status", views.StatusViewSet)

# MARK: Bridge Tables

router.register(r"group_events", views.GroupEventViewSet)
router.register(r"group_images", views.GroupImageViewSet)
router.register(r"group_members", views.GroupMemberViewSet)
router.register(r"group_resources", views.GroupResourceViewSet)
router.register(r"group_texts", views.GroupTextViewSet)
router.register(r"group_topics", views.GroupTopicViewSet)

router.register(r"organization_applications", views.OrganizationApplicationViewSet)
router.register(r"organization_events", views.OrganizationEventViewSet)
router.register(r"organization_images", views.OrganizationImageViewSet)
router.register(r"organization_members", views.OrganizationMemberViewSet)
router.register(r"organization_resources", views.OrganizationResourceViewSet)
router.register(r"organization_tasks", views.OrganizationTaskViewSet)
router.register(r"organization_texts", views.OrganizationTextViewSet)
router.register(r"organization_topics", views.OrganizationTopicViewSet)

router.register(r"status_type", views.StatusTypeViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
