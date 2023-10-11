from rest_framework import viewsets

from backend.paginator import CustomPagination

from .models import Support, SupportEntityType, User, UserResource, UserTask, UserTopic
from .serializers import (
    SupportEntityTypeSerializer,
    SupportSerializer,
    UserResourceSerializer,
    UserSerializer,
    UserTaskSerializer,
    UserTopicSerializer,
)


class SupportEntityTypeViewSet(viewsets.ModelViewSet[SupportEntityType]):
    queryset = SupportEntityType.objects.all()
    pagination_class = CustomPagination
    serializer_class = SupportEntityTypeSerializer


class SupportViewSet(viewsets.ModelViewSet[Support]):
    queryset = Support.objects.all()
    pagination_class = CustomPagination
    serializer_class = SupportSerializer


class UserViewSet(viewsets.ModelViewSet[User]):
    queryset = User.objects.all()
    pagination_class = CustomPagination
    serializer_class = UserSerializer


class UserResourceViewSet(viewsets.ModelViewSet[UserResource]):
    queryset = UserResource.objects.all()
    pagination_class = CustomPagination
    serializer_class = UserResourceSerializer


class UserTaskViewSet(viewsets.ModelViewSet[UserTask]):
    queryset = UserTask.objects.all()
    pagination_class = CustomPagination
    serializer_class = UserTaskSerializer


class UserTopicViewSet(viewsets.ModelViewSet[UserTopic]):
    queryset = UserTopic.objects.all()
    pagination_class = CustomPagination
    serializer_class = UserTopicSerializer
