from rest_framework import viewsets
from backend.paginator import CustomPagination
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
    pagination_class = CustomPagination


class TaskViewSet(viewsets.ModelViewSet[Task]):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    pagination_class = CustomPagination


class TopicViewSet(viewsets.ModelViewSet[Topic]):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    pagination_class = CustomPagination


class ResourceTopicViewSet(viewsets.ModelViewSet[ResourceTopic]):
    queryset = ResourceTopic.objects.all()
    serializer_class = ResourceTopicSerializer
    pagination_class = CustomPagination


class TopicFormatViewSet(viewsets.ModelViewSet[TopicFormat]):
    queryset = TopicFormat.objects.all()
    serializer_class = TopicFormatSerializer
    pagination_class = CustomPagination
