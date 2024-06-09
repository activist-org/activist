import os
import uuid
from uuid import UUID


import dotenv
from django.contrib.auth import login
from django.core.mail import send_mail
from django.template.loader import render_to_string
from drf_spectacular.utils import OpenApiParameter, extend_schema

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
    PasswordResetSerializer,
    SignupSerializer,
    SupportEntityTypeSerializer,
    SupportSerializer,
    UserResourceSerializer,
    UserSerializer,
    UserTaskSerializer,
    UserTopicSerializer,
)

dotenv.load_dotenv()

FRONTEND_BASE_URL = os.getenv("VITE_FRONTEND_URL")
ACTIVIST_EMAIL = os.getenv("ACTIVIST_EMAIL")


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
        """Create a new user."""
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user: UserModel = serializer.save()

        if user.email != "":
            user.code = uuid.uuid4()

            confirmation_link = f"{FRONTEND_BASE_URL}/confirm/{user.code}"
            message = f"Welcome to activist.org, {user.username}!, Please confirm your email address by clicking the link: {confirmation_link}"
            html_message = render_to_string(
                template_name="signup_email.html",
                context={
                    "username": user.username,
                    confirmation_link: confirmation_link,
                },
            )

            send_mail(
                subject="Welcome to activist.org",
                message=message,
                from_email=ACTIVIST_EMAIL,
                recipient_list=[user.email],
                html_message=html_message,
                fail_silently=False,
            )

            user.save()

        return Response(
            {"message": "User was created successfully"},
            status=status.HTTP_201_CREATED,
        )

    @extend_schema(parameters=[OpenApiParameter(name="code", type=str, required=True)])
    def get(self, request: Request) -> Response:
        """Confirm a user's email address."""
        code = request.GET.get("code")
        user = UserModel.objects.filter(code=code).first()

        if user is None:
            return Response(
                {"message": "User does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )

        user.is_confirmed = True
        user.code = ""
        user.save()

        return Response(
            {"message": "Email is confirmed. You can now log in."},
            status=status.HTTP_201_CREATED,
        )


@method_decorator(csrf_exempt, name="dispatch")
class LoginView(APIView):
    serializer_class = LoginSerializer
    permission_classes = (AllowAny,)

    def post(self, request: Request) -> Response:
        """Log in a user.

        Login is possible with either email or username
        """
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


class PasswordResetView(APIView):
    serializer_class = PasswordResetSerializer
    permission_classes = (AllowAny,)
    queryset = UserModel.objects.all()

    @extend_schema(parameters=[OpenApiParameter(name="email", type=str, required=True)])
    def get(self, request: Request) -> Response:
        email = request.query_params.get("email")
        user = UserModel.objects.filter(email=email).first()

        if user is None:
            return Response(
                {"message": "User does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )

        user.code = uuid.uuid4()

        pwreset_link = f"{FRONTEND_BASE_URL}/pwreset/{user.code}"
        message = "Reset your password at activist.org"
        html_message = render_to_string(
            template_name="pwreset_email.html",
            context={"username": user.username, pwreset_link: pwreset_link},
        )

        send_mail(
            subject="Reset your password at activist.org",
            message=message,
            from_email=ACTIVIST_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )

        user.save()

        return Response(
            {"message": "Password reset email was sent successfully"},
            status=status.HTTP_200_OK,
        )

    def post(self, request: Request) -> Response:
        serializer = PasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data

        user.set_password(request.data.get("password"))
        user.save()

        return Response(
            {"message": "Password was reset successfully"},
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
