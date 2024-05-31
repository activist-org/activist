from uuid import UUID

from django.contrib.auth import get_user_model, login
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
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
    LoginSerializer,
    SignupSerializer,
    SupportEntityTypeSerializer,
    SupportSerializer,
    UserResourceSerializer,
    UserSerializer,
    UserTaskSerializer,
    UserTopicSerializer,
)

USER = get_user_model()


class SupportEntityTypeViewSet(viewsets.ModelViewSet[SupportEntityType]):
    queryset = SupportEntityType.objects.all()
    pagination_class = CustomPagination
    serializer_class = SupportEntityTypeSerializer


class SupportViewSet(viewsets.ModelViewSet[Support]):
    queryset = Support.objects.all()
    pagination_class = CustomPagination
    serializer_class = SupportSerializer


class UserViewSet(viewsets.ModelViewSet[User]):
    queryset = USER.objects.all()
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
            {"message": "User was created successfully"},
            status=status.HTTP_201_CREATED,
        )


@method_decorator(csrf_exempt, name="dispatch")
class LoginView(APIView):
    serializer_class = LoginSerializer
    permission_classes = (AllowAny,)

    def post(self, request: Request) -> Response:
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        login(request, serializer.validated_data.get("user"))

        return Response(
            {
                "token": serializer.validated_data.get("token"),
                "message": "User was logged in successfully",
            },
            status=status.HTTP_200_OK,
        )


class DeleteUserView(APIView):
    queryset = UserModel.objects.all()
    permission_classes = (IsAuthenticated,)

    def delete(self, request: Request, pk: UUID | str) -> Response:
        user = UserModel.objects.get(pk=pk)

        if user is None:
            return Response(
                {"message": "User does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )

        user.delete()

        return Response(
            {"message": "User was deleted successfully"},
            status=status.HTTP_204_NO_CONTENT,
        )
