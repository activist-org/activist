from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from backend.paginator import CustomPagination

from .models import (
    Support,
    SupportEntityType,
    UserModel,
    UserResource,
    UserTask,
    UserTopic,
)
from .serializers import (
    SignupSerializer,
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


class UserViewSet(viewsets.ModelViewSet[UserModel]):
    queryset = UserModel.objects.all()
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


class SignupView(APIView):
    queryset = UserModel.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = SignupSerializer

    def post(self, request: Request) -> Response:
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {"message": "User was created successful"},
            status=status.HTTP_201_CREATED,
        )

    def delete(self, request: Request) -> Response:
        user = UserModel.objects.filter(id=request.data.get("id")).first()
        if user is None:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )

        user.delete()
        return Response(
            {"message": "User deleted successfully"}, status=status.HTTP_200_OK
        )
