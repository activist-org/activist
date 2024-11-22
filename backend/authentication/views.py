import os
import uuid
from uuid import UUID

import dotenv
from django.contrib.auth import login
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from drf_spectacular.utils import OpenApiParameter, extend_schema
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
    UserSocialLink,
    UserTask,
    UserTopic,
)
from .serializers import (
    DeleteUserResponseSerializer,
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


# MARK: Main Tables


class SupportViewSet(viewsets.ModelViewSet[Support]):
    queryset = Support.objects.all()
    pagination_class = CustomPagination
    serializer_class = SupportSerializer


class UserViewSet(viewsets.ModelViewSet[UserModel]):
    queryset = UserModel.objects.all()
    pagination_class = CustomPagination
    serializer_class = UserSerializer


# MARK: Bridge Tables


class SupportEntityTypeViewSet(viewsets.ModelViewSet[SupportEntityType]):
    queryset = SupportEntityType.objects.all()
    pagination_class = CustomPagination
    serializer_class = SupportEntityTypeSerializer


class UserResourceViewSet(viewsets.ModelViewSet[UserResource]):
    queryset = UserResource.objects.all()
    pagination_class = CustomPagination
    serializer_class = UserResourceSerializer


class UserSocialLinkViewSet(viewsets.ModelViewSet[UserSocialLink]):
    queryset = UserSocialLink.objects.all()
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


# MARK: Methods


class SignUpView(APIView):
    queryset = UserModel.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = SignupSerializer

    def post(self, request: Request) -> Response:
        """
        Create a new user.
        """
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user: UserModel = serializer.save()

        if user.email != "":
            user.verification_code = uuid.uuid4()

            confirmation_link = f"{FRONTEND_BASE_URL}/confirm/{user.verification_code}"
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
            {"message": "User was created successfully."},
            status=status.HTTP_201_CREATED,
        )

    @extend_schema(
        parameters=[OpenApiParameter(name="verification_code", type=str, required=True)]
    )
    def get(self, request: Request) -> Response:
        """
        Confirm a user's email address.
        """
        verification_code = request.GET.get("verification_code")
        user = UserModel.objects.filter(verification_code=verification_code).first()

        if user is None:
            return Response(
                {"message": "User does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )

        user.is_confirmed = True
        user.verification_code = ""
        user.save()

        return Response(
            {"message": "Email is confirmed. You can now log in."},
            status=status.HTTP_201_CREATED,
        )


@method_decorator(csrf_exempt, name="dispatch")
class SignInView(APIView):
    serializer_class = LoginSerializer
    permission_classes = (AllowAny,)

    def post(self, request: Request) -> Response:
        """
        Sign in a user.

        Sign in is possible with either email or username.
        """
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        login(request, serializer.validated_data.get("user"))

        return Response(
            {
                "token": serializer.validated_data.get("token"),
                "message": "User was logged in successfully.",
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
                {"message": "User does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )

        user.verification_code = uuid.uuid4()

        pwreset_link = f"{FRONTEND_BASE_URL}/pwreset/{user.verification_code}"
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
            {"message": "Password reset email was sent successfully."},
            status=status.HTTP_200_OK,
        )

    def post(self, request: Request) -> Response:
        data = {
            "password": request.data.get("password"),
            "code": request.query_params.get("code"),
        }
        serializer = PasswordResetSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        user: UserModel = serializer.validated_data

        user.set_password(request.data.get("password"))
        user.save()

        return Response(
            {"message": "Password was reset successfully."},
            status=status.HTTP_200_OK,
        )


class DeleteUserView(APIView):
    queryset = UserModel.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = DeleteUserResponseSerializer

    def delete(self, request: Request, pk: UUID | str) -> Response:
        user = UserModel.objects.get(pk=pk)

        if user is None:
            return Response(
                {"message": "User does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )

        user.delete()

        return Response(
            {"message": "User was deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )
