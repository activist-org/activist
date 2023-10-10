from rest_framework import viewsets

from .models import Resource, ResourceTopic, Task, Topic, TopicFormat
from .serializers import (
    ResourceSerializer,
    ResourceTopicSerializer,
    TaskSerializer,
    TopicFormatSerializer,
    TopicSerializer,
)


class ResourceViewSet(viewsets.ModelViewSet[Resource]):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer


class TaskViewSet(viewsets.ModelViewSet[Task]):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class TopicViewSet(viewsets.ModelViewSet[Topic]):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer


class ResourceTopicViewSet(viewsets.ModelViewSet[ResourceTopic]):
    queryset = ResourceTopic.objects.all()
    serializer_class = ResourceTopicSerializer


class TopicFormatViewSet(viewsets.ModelViewSet[TopicFormat]):
    queryset = TopicFormat.objects.all()
    serializer_class = TopicFormatSerializer
