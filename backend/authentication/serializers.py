# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Serializers for the authentication app.
"""

import logging
import re
from typing import Any, Dict, Union

from django.contrib.auth import authenticate, get_user_model
from django.utils.translation import gettext as _
from rest_framework import serializers
from rest_framework.authtoken.models import Token

from authentication.models import UserFlag, UserModel

logger = logging.getLogger(__name__)
USER = get_user_model()


class DeleteUserResponseSerializer(serializers.Serializer[UserModel]):
    """
    Serializer for the response data of a user deletion request.
    """

    message = serializers.CharField(max_length=200)


# MARK: Sign Up


class SignUpSerializer(serializers.ModelSerializer[UserModel]):
    """
    Serializer for the sign up flow data.
    """

    password_confirmed = serializers.CharField(write_only=True)

    class Meta:
        model = USER
        fields = ("username", "password", "password_confirmed", "email")
        extra_kwargs = {"password": {"write_only": True}, "email": {"required": False}}

    def validate(self, data: Dict[str, Union[str, Any]]) -> Dict[str, Union[str, Any]]:
        """
        Validate the data before signing up a user.

        Parameters
        ----------
        data : dict[str, Union[str, Any]]
            Data from a request to validate.

        Returns
        -------
        dict[str, Union[str, Any]]
            Validated data for processing.
        """
        pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{12,}$"

        if not re.match(pattern, data["password"]):
            logger.warning(
                "Password validation failed for username: %s - password does not meet complexity requirements",
                data.get("username", "unknown"),
            )
            raise serializers.ValidationError(
                _(
                    "The field password must be at least 12 characters long and contain at least one special character."
                ),
                code="invalid_password",
            )

        if data["password"] != data["password_confirmed"]:
            logger.warning(
                "Password confirmation failed for username: %s - passwords do not match",
                data.get("username", "unknown"),
            )
            raise serializers.ValidationError(
                _("The passwords did not match. Please try again."),
                code="invalid_password_confirmation",
            )

        logger.info(
            "User signup validation successful for username: %s", data.get("username")
        )
        return data

    def create(self, validated_data: Dict[str, Union[str, Any]]) -> UserModel:
        """
        Create and return a new UserModel instance.

        Parameters
        ----------
        validated_data : dict[str, Union[str, Any]]
            Data from a request to validate.

        Returns
        -------
        UserModel
            A new UserModel instance.
        """
        validated_data.pop("password_confirmed")

        try:
            user: UserModel = UserModel.objects.create_user(**validated_data)
            user.save()
            logger.info(
                "New user created successfully: %s (ID: %s)", user.username, user.id
            )
            return user
        except Exception as e:
            logger.exception(
                "Failed to create user with username: %s - %s",
                validated_data.get("username", "unknown"),
                str(e),
            )
            raise


# MARK: Sign In


class SignInSerializer(serializers.Serializer[UserModel]):
    """
    Serializer for the sign in flow data.
    """

    email = serializers.EmailField(required=False)
    username = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True)
    session_id = serializers.UUIDField(required=False, allow_null=True)

    def validate(self, data: Dict[str, Union[str, Any]]) -> Dict[str, Union[str, Any]]:
        """
        Validate the data before signing in a user.

        Parameters
        ----------
        data : dict[str, Union[str, Any]]
            Data from a request to validate.

        Returns
        -------
        dict[str, Union[str, Any]]
            Validated data for processing.
        """
        identifier = data.get("email") or data.get("username", "unknown")

        if not data.get("email"):
            user = UserModel.objects.filter(username=data.get("username")).first()
        else:
            user = UserModel.objects.filter(email=data.get("email")).first()

        if user is None:
            logger.warning("Sign in attempt failed - user not found: %s", identifier)
            raise serializers.ValidationError(
                ("Invalid credentials. Please try again."),
                code="invalid_credentials",
            )

        authenticated_user: UserModel = authenticate(
            username=user,
            password=data.get("password"),
        )  # type: ignore

        if authenticated_user is None:
            logger.warning(
                "Sign in attempt failed - invalid password for user: %s (ID: %s)",
                user.username,
                user.id,
            )
            raise serializers.ValidationError(
                ("Invalid credentials. Please try again."),
                code="invalid_credentials",
            )

        if authenticated_user.email != "" and authenticated_user.is_confirmed is False:
            logger.warning(
                "Sign in attempt failed - email not confirmed for user: %s (ID: %s)",
                user.username,
                user.id,
            )
            raise serializers.ValidationError(
                ("Please confirm your email address."),
                code="email_not_confirmed",
            )

        data["user"] = authenticated_user

        try:
            token, _ = Token.objects.get_or_create(user=user)
            data["token"] = token.key
            data["user"] = user
            logger.info(
                "User signed in successfully: %s (ID: %s)", user.username, user.id
            )
        except Exception as e:
            logger.exception(
                "Failed to create/get authentication token for user: %s (ID: %s) - %s",
                user.username,
                user.id,
                str(e),
            )
            raise

        return data


# class SessionSerializer(serializers.ModelSerializer[SessionModel]):
#     """
#     Serializer for the session model.
#     """

#     class Meta:
#         model = SessionModel
#         fields = ("id", "user", "session_key", "created_at")
#         read_only_fields = ("id", "created_at")


# MARK: Pass Reset


class PasswordResetSerializer(serializers.Serializer[UserModel]):
    """
    Serializer for the password reset flow data.
    """

    email = serializers.EmailField(required=False)
    password = serializers.CharField(write_only=True)
    code = serializers.UUIDField(required=False)

    def validate(self, data: Dict[str, Union[str, Any]]) -> UserModel:
        """
        Validate the data before signing up a user.

        Parameters
        ----------
        data : dict[str, Union[str, Any]]
            Data from a request to validate.

        Returns
        -------
        UserModel
            The user with a reset password.
        """
        if data.get("code") is not None:
            user = UserModel.objects.filter(verification_code=data.get("code")).first()
            identifier = f"code: {data.get('code')}"
        else:
            user = UserModel.objects.filter(email=data.get("email")).first()
            identifier = f"email: {data.get('email')}"

        if user is None:
            logger.warning(
                "Password reset attempt failed - user not found: %s", identifier
            )
            raise serializers.ValidationError(
                _("Invalid email address. Please try again."),
                code="invalid_email",
            )

        logger.info(
            "Password reset validation successful for user: %s (ID: %s)",
            user.username,
            user.id,
        )
        return user


# MARK: UserFlag


class UserFlagSerializers(serializers.ModelSerializer[UserFlag]):
    """
    Serializers for UserFlag model.
    """

    class Meta:
        model = UserFlag
        fields = "__all__"
