from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = "content"

router = DefaultRouter()
router.register(r"resources", views.ResourceViewSet)
router.register(r"tasks", views.TaskViewSet)
router.register(r"topics", views.TopicViewSet)
router.register(r"resource_topics", views.ResourceTopicViewSet)
router.register(r"topic_formats", views.TopicFormatViewSet)
router.register(r"faq", views.FaqViewSet)


urlpatterns = [
    path("", include(router.urls)),
]
