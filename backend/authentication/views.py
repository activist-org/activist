from rest_framework import viewsets

from .models import Support, SupportEntityType, User, UserResource, UserTask, UserTopic
from .serializers import (
    SupportEntityTypeSerializer,
    SupportSerializer,
    UserResourceSerializer,
    UserSerializer,
    UserTaskSerializer,
    UserTopicSerializer,
)


class SupportEntityTypeViewSet(viewsets.ModelViewSet):
    queryset = SupportEntityType.objects.all()
    serializer_class = SupportEntityTypeSerializer


class SupportViewSet(viewsets.ModelViewSet):
    queryset = Support.objects.all()
    serializer_class = SupportSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserResourceViewSet(viewsets.ModelViewSet):
    queryset = UserResource.objects.all()
    serializer_class = UserResourceSerializer


class UserTaskViewSet(viewsets.ModelViewSet):
    queryset = UserTask.objects.all()
    serializer_class = UserTaskSerializer


class UserTopicViewSet(viewsets.ModelViewSet):
    queryset = UserTopic.objects.all()
    serializer_class = UserTopicSerializer
