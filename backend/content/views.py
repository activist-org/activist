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


class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    pagination_class = CustomPagination


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    pagination_class = CustomPagination


class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    pagination_class = CustomPagination


class ResourceTopicViewSet(viewsets.ModelViewSet):
    queryset = ResourceTopic.objects.all()
    serializer_class = ResourceTopicSerializer
    pagination_class = CustomPagination


class TopicFormatViewSet(viewsets.ModelViewSet):
    queryset = TopicFormat.objects.all()
    serializer_class = TopicFormatSerializer
    pagination_class = CustomPagination
