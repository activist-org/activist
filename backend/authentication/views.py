# SPDX-License-Identifier: AGPL-3.0-or-later
"""
API views for authentication management.
"""

import logging
import os
import uuid

import dotenv
from django.contrib.auth import login
from django.core.mail import send_mail
from django.db.utils import IntegrityError, OperationalError
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
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.generics import GenericAPIView
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
from core.permissions import IsAdminStaffCreatorOrReadOnly

logger = logging.getLogger(__name__)

dotenv.load_dotenv()

FRONTEND_BASE_URL = os.getenv("VITE_FRONTEND_URL")
ACTIVIST_EMAIL = os.getenv("ACTIVIST_EMAIL")

# MARK: Methods


class SignUpView(APIView):
    queryset = UserModel.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = SignUpSerializer

    def post(self, request: Request) -> Response:
        logger.info("User registration attempt")
        serializer = SignUpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user: UserModel = serializer.save()

        logger.info(f"User created successfully: {user.username} (ID: {user.id})")

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

            try:
                send_mail(
                    subject="Welcome to activist.org",
                    message=message,
                    from_email=ACTIVIST_EMAIL,
                    recipient_list=[user.email],
                    html_message=html_message,
                    fail_silently=False,
                )
                logger.info(f"Verification email sent to {user.email}")
            except Exception as e:
                logger.error(f"Failed to send verification email to {user.email}: {e}")
                # Continue with user creation even if email fails

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
        logger.info(f"Email verification attempt with code: {verification_code}")
        
        user = UserModel.objects.filter(verification_code=verification_code).first()

        if user is None:
            logger.warning(f"Email verification failed: invalid code {verification_code}")
            return Response(
                {"detail": "User does not exist."},
                status=status.HTTP_404_NOT_FOUND,
            )

        user.is_confirmed = True
        user.verification_code = ""
        user.save()
        
        logger.info(f"Email verified successfully for user: {user.username} (ID: {user.id})")

        return Response(
            {"message": "Email is confirmed. You can now log in."},
            status=status.HTTP_201_CREATED,
        )


@method_decorator(csrf_exempt, name="dispatch")
class SignInView(APIView):
    serializer_class = SignInSerializer
    permission_classes = (AllowAny,)

    def post(self, request: Request) -> Response:
        logger.info("User login attempt")
        serializer = SignInSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data.get("user")
        login(request, user)
        
        logger.info(f"User logged in successfully: {user.username} (ID: {user.id})")

        return Response(
            {
                "token": serializer.validated_data.get("token"),
                "message": "User was logged in successfully.",
            },
            status=status.HTTP_200_OK,
        )


class GetSessionView(APIView):
    # serializer_class = SessionSerializer
    # permission_classes = (IsAuthenticated,)
    # queryset = UserModel.objects.all()
    # authentication_classes = (TokenAuthentication,)
    def get(self, request: Request) -> Response:
        #     session = request.user.session_set.first()
        #     if not session:
        #         return Response(
        #             {"detail": "No active session found."},
        #             status=status.HTTP_404_NOT_FOUND,
        #         )

        #     serializer = SessionSerializer(session)
        #     return Response(serializer.data, status=status.HTTP_200_OK)
        data = {
            "user": {"id": "1", "username": "admin", "is_admin": "false"},
            "id": "1",
        }
        return Response(
            data,
            status=status.HTTP_200_OK,
        )


class PasswordResetView(APIView):
    serializer_class = PasswordResetSerializer
    permission_classes = (AllowAny,)
    queryset = UserModel.objects.all()

    @extend_schema(parameters=[OpenApiParameter(name="email", type=str, required=True)])
    def get(self, request: Request) -> Response:
        email = request.query_params.get("email")
        logger.info(f"Password reset request for email: {email}")
        
        user = UserModel.objects.filter(email=email).first()

        if user is None:
            logger.warning(f"Password reset failed: user not found for email {email}")
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

        try:
            send_mail(
                subject="Reset your password at activist.org",
                message=message,
                from_email=ACTIVIST_EMAIL,
                recipient_list=[user.email],
                html_message=html_message,
                fail_silently=False,
            )
            logger.info(f"Password reset email sent to {user.email}")
        except Exception as e:
            logger.error(f"Failed to send password reset email to {user.email}: {e}")
            return Response(
                {"detail": "Failed to send password reset email."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        user.save()

        return Response(
            {"message": "Password reset email was sent successfully."},
            status=status.HTTP_200_OK,
        )

    def post(self, request: Request) -> Response:
        code = request.query_params.get("code")
        logger.info(f"Password reset attempt with code: {code}")
        
        data = {
            "password": request.data.get("password"),
            "code": code,
        }
        serializer = PasswordResetSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        user: UserModel = serializer.validated_data

        user.set_password(request.data.get("password"))
        user.save()
        
        logger.info(f"Password reset successfully for user: {user.username} (ID: {user.id})")

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
        user_id = request.user.id
        username = request.user.username
        logger.info(f"User account deletion requested: {username} (ID: {user_id})")
        
        request.user.delete()
        
        logger.info(f"User account deleted successfully: {username} (ID: {user_id})")
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserFlagAPIView(GenericAPIView[UserFlag]):
    queryset = UserFlag.objects.all()
    serializer_class = UserFlagSerializers
    permission_classes = (IsAuthenticated,)

    @extend_schema(responses={200: UserFlagSerializers(many=True)})
    def get(self, request: Request) -> Response:
        logger.info(f"User flag list requested by user: {request.user.username}")
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        responses={
            201: UserFlagSerializers,
            400: OpenApiResponse(response={"detail": "Failed to create flag."}),
        }
    )
    def post(self, request: Request) -> Response:
        logger.info(f"User flag creation requested by user: {request.user.username}")
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)

        try:
            serializer.save(created_by=request.user)
            logger.info(f"User flag(s) created successfully by user: {request.user.username}")

        except (IntegrityError, OperationalError) as e:
            logger.error(f"Failed to create user flag(s) by {request.user.username}: {e}")
            return Response(
                {"detail": "Failed to create flag."}, status=status.HTTP_400_BAD_REQUEST
            )

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UserFlagDetailAPIView(GenericAPIView[UserFlag]):
    queryset = UserFlag.objects.all()
    serializer_class = UserFlagSerializers
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAdminStaffCreatorOrReadOnly,)

    @extend_schema(
        responses={
            200: UserFlagSerializers,
            404: OpenApiResponse(
                response={"detail": "Failed to retrieve the user flag."}
            ),
        }
    )
    def get(self, request: Request, id: str | uuid.UUID) -> Response:
        logger.info(f"User flag detail requested: ID {id} by user {request.user.username}")
        try:
            flag = UserFlag.objects.get(id=id)

        except UserFlag.DoesNotExist:
            logger.warning(f"User flag not found: ID {id}")
            return Response(
                {"detail": "Failed to retrieve the flag."},
                status=status.HTTP_404_NOT_FOUND,
            )

        self.check_object_permissions(request, flag)

        serializer = UserFlagSerializers(flag)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        responses={
            204: OpenApiResponse(response={"message": "Flag deleted successfully."}),
            401: OpenApiResponse(
                response={"detail": "You are not authorized to delete this flag."}
            ),
            403: OpenApiResponse(
                response={"detail": "You are not authorized to delete this flag."}
            ),
            404: OpenApiResponse(response={"detail": "Failed to retrieve flag."}),
        }
    )
    def delete(self, request: Request, id: str | uuid.UUID) -> Response:
        logger.info(f"User flag deletion requested: ID {id} by user {request.user.username}")
        try:
            flag = UserFlag.objects.get(id=id)

        except UserFlag.DoesNotExist:
            logger.warning(f"User flag not found for deletion: ID {id}")
            return Response(
                {"detail": "Flag not found."}, status=status.HTTP_404_NOT_FOUND
            )

        self.check_object_permissions(request, flag)

        flag.delete()
        logger.info(f"User flag deleted successfully: ID {id} by user {request.user.username}")
        return Response(
            {"message": "Flag deleted successfully."}, status=status.HTTP_204_NO_CONTENT
        )
