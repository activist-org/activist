from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = "events"

router = DefaultRouter()

# MARK: Main Tables

router.register(prefix=r"events", viewset=views.EventViewSet)
router.register(prefix=r"formats", viewset=views.FormatViewSet)
router.register(prefix=r"roles", viewset=views.RoleViewSet)

# MARK: Bridge Tables

router.register(prefix=r"event_attendees", viewset=views.EventAttendeeViewSet)
router.register(
    prefix=r"event_attendee_statuses", viewset=views.EventAttendeeStatusViewSet
)
router.register(prefix=r"event_discussions", viewset=views.EventDiscussionViewSet)
router.register(prefix=r"event_faqs", viewset=views.EventFaqViewSet)
router.register(prefix=r"event_formats", viewset=views.EventFormatViewSet)
router.register(prefix=r"event_resources", viewset=views.EventResourceViewSet)
router.register(prefix=r"event_roles", viewset=views.EventRoleViewSet)
router.register(prefix=r"event_social_links", viewset=views.EventSocialLinkViewSet)
router.register(prefix=r"event_tasks", viewset=views.EventTaskViewSet)
router.register(prefix=r"event_texts", viewset=views.EventTextViewSet)
router.register(prefix=r"event_topics", viewset=views.EventTopicViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
