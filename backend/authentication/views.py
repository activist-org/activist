# SPDX-License-Identifier: AGPL-3.0-or-later
"""
API views for authentication management.
"""

import os
import uuid

import dotenv
from django.contrib.auth import login
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import (
    OpenApiExample,
    OpenApiParameter,
    OpenApiResponse,
    extend_schema,
)
from rest_framework import status, viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from authentication.models import UserFlag, UserModel
from authentication.serializers import (
    DeleteUserResponseSerializer,
    PasswordResetSerializer,
    SignInSerializer,
    SignUpSerializer,
    UserFlagSerializers,
)

dotenv.load_dotenv()

FRONTEND_BASE_URL = os.getenv("VITE_FRONTEND_URL")
ACTIVIST_EMAIL = os.getenv("ACTIVIST_EMAIL")

# MARK: Methods


class SignUpView(APIView):
    queryset = UserModel.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = SignUpSerializer

    def post(self, request: Request) -> Response:
        serializer = SignUpSerializer(data=request.data)
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
        verification_code = request.GET.get("verification_code")
        user = UserModel.objects.filter(verification_code=verification_code).first()

        if user is None:
            return Response(
                {"detail": "User does not exist."},
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
    serializer_class = SignInSerializer
    permission_classes = (AllowAny,)

    def post(self, request: Request) -> Response:
        serializer = SignInSerializer(data=request.data)
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
                {"detail": "User does not exist."},
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
    authentication_classes = (TokenAuthentication,)

    @extend_schema(
        summary="Delete own account",
        responses={
            204: OpenApiResponse(
                description="Account deleted successfully",
            ),
            400: OpenApiResponse(
                response=OpenApiTypes.OBJECT,
                description="Bad request",
                examples=[
                    OpenApiExample(
                        name="Bad request",
                        value={"detail": "Bad request."},
                        media_type="application/json",
                    )
                ],
            ),
            401: OpenApiResponse(
                response=OpenApiTypes.OBJECT,
                description="Unauthorized",
                examples=[
                    OpenApiExample(
                        name="Unauthorized",
                        value={"detail": "Invalid token."},
                        media_type="application/json",
                    ),
                    OpenApiExample(
                        name="User not authorized",
                        value={
                            "detail": "Authentication credentials were not provided."
                        },
                        media_type="application/json",
                    ),
                ],
            ),
        },
    )
    def delete(self, request: Request) -> Response:
        request.user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserFlagViewSets(viewsets.ModelViewSet[UserFlag]):
    queryset = UserFlag.objects.all()
    serializer_class = UserFlagSerializers
    http_method_names = ["get", "post", "delete"]

    def create(self, request: Request) -> Response:
        if request.user.is_authenticated:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(
            {"detail": "You are not allowed flag this user."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    def list(self, request: Request) -> Response:
        query = self.queryset.filter()
        serializer = self.get_serializer(query, many=True)

        return self.get_paginated_response(self.paginate_queryset(serializer.data))

    def retrieve(self, request: Request, pk: str | None) -> Response:
        if pk is not None:
            query = self.queryset.filter(id=pk).first()

        else:
            return Response(
                {"detail": "Invalid ID"}, status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(query)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request: Request) -> Response:
        item = self.get_object()
        if request.user.is_staff:
            self.perform_destroy(item)
            return Response(status=status.HTTP_204_NO_CONTENT)

        else:
            return Response(
                {"detail": "You are authorized to delete this flag."},
                status=status.HTTP_403_FORBIDDEN,
            )
