from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = "events"

router = DefaultRouter()

# MARK: Main Tables

router.register(r"events", views.EventViewSet)
router.register(r"formats", views.FormatViewSet)
router.register(r"roles", views.RoleViewSet)

# MARK: Bridge Tables

router.register(r"event_attendees", views.EventAttendeeViewSet)
router.register(r"event_formats", views.EventFormatViewSet)
router.register(r"event_attendee_statuses", views.EventAttendeeStatusViewSet)
router.register(r"event_resources", views.EventResourceViewSet)
router.register(r"event_roles", views.EventRoleViewSet)
router.register(r"event_tasks", views.EventTaskViewSet)
router.register(r"event_texts", views.EventTextViewSet)
router.register(r"event_topics", views.EventTopicViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
