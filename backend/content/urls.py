from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views


<<<<<<< HEAD
=======
app_name = 'content'

>>>>>>> add_viewsets
router = DefaultRouter()
router.register(r'resources', views.ResourceViewSet)
router.register(r'tasks', views.TaskViewSet)
router.register(r'topics', views.TopicViewSet)
router.register(r'resource_topics', views.ResourceTopicViewSet)
router.register(r'topic_formats', views.TopicFormatViewSet)


urlpatterns = [
    path('', include(router.urls)),
]
