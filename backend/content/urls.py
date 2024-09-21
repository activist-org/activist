from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = "content"

router = DefaultRouter()

# MARK: Main Tables

router.register(r"discussion", views.DiscussionViewSet)
router.register(r"faq", views.FaqViewSet)
router.register(r"images", views.ImageViewSet)
router.register(r"resources", views.ResourceViewSet)
router.register(r"tasks", views.TaskViewSet)
router.register(r"topics", views.TopicViewSet)

# MARK: Bridge Tables

router.register(r"discussion_entry", views.DiscussionEntryViewSet)
router.register(r"resource_topics", views.ResourceTopicViewSet)
router.register(r"topic_formats", views.TopicFormatViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
