from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = "content"

router = DefaultRouter()

# MARK: Main Tables

router.register(prefix=r"discussions", viewset=views.DiscussionViewSet)
router.register(prefix=r"faqs", viewset=views.FaqViewSet)
router.register(prefix=r"images", viewset=views.ImageViewSet)
router.register(prefix=r"locations", viewset=views.LocationViewSet)
router.register(prefix=r"resources", viewset=views.ResourceViewSet)
router.register(prefix=r"roles", viewset=views.RoleViewSet)
router.register(prefix=r"social_links", viewset=views.SocialLinkViewSet)
router.register(prefix=r"tags", viewset=views.TagViewSet)
router.register(prefix=r"tasks", viewset=views.TaskViewSet)
router.register(prefix=r"topics", viewset=views.TopicViewSet)

# MARK: Bridge Tables

router.register(prefix=r"discussion_entries", viewset=views.DiscussionEntryViewSet)
router.register(prefix=r"discussion_tags", viewset=views.DiscussionTagViewSet)
router.register(prefix=r"resource_tags", viewset=views.ResourceTagViewSet)
router.register(prefix=r"resource_topics", viewset=views.ResourceTopicViewSet)
router.register(prefix=r"task_tags", viewset=views.TaskTagViewSet)
router.register(prefix=r"topic_formats", viewset=views.TopicFormatViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
