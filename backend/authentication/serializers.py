# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Serializers for the authentication app.
"""

import re
from typing import Any, Dict, Union

from django.contrib.auth import authenticate, get_user_model
from django.utils.translation import gettext as _
from rest_framework import serializers
from rest_framework.authtoken.models import Token

from authentication.models import UserModel

USER = get_user_model()


class DeleteUserResponseSerializer(serializers.Serializer[UserModel]):
    """
    Serializer for the response message when a user is deleted.
    """

    message = serializers.CharField(max_length=200)


class SignupSerializer(serializers.ModelSerializer[UserModel]):
    """
    Serializer for user registration (signup).
    """

    password_confirmed = serializers.CharField(write_only=True)

    class Meta:
        """Meta settings for the serializer."""

        model = USER
        fields = ("username", "password", "password_confirmed", "email")
        extra_kwargs = {"password": {"write_only": True}, "email": {"required": False}}

    def validate(self, data: Dict[str, Union[str, Any]]) -> Dict[str, Union[str, Any]]:
        """
        Validate that the password is strong enough and that the two password fields match.

        Password must be at least 12 characters long and contain at least one special character.

        Parameters
        ----------
        data : Dict[str, Union[str, Any]]
            Data to validate.

        Returns
        -------
        Dict[str, Union[str, Any]]
            Returns the validated data.
        """
        pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{12,}$"

        if not re.match(pattern, data["password"]):
            raise serializers.ValidationError(
                _(
                    "The field password must be at least 12 characters long and contain at least one special character."
                ),
                code="invalid_password",
            )

        if data["password"] != data["password_confirmed"]:
            raise serializers.ValidationError(
                _("The passwords did not match. Please try again."),
                code="invalid_password_confirmation",
            )

        return data

    def create(self, validated_data: Dict[str, Union[str, Any]]) -> UserModel:
        """
        Create a new user with the provided validated data.

        Removes `password_confirmed` before creating the user.

        Parameters
        ----------
        validated_data : Dict[str, Union[str, Any]]
            Data to validate.

        Returns
        -------
        UserModel
            The created user.
        """
        validated_data.pop("password_confirmed")

        user: UserModel = UserModel.objects.create_user(**validated_data)
        user.save()

        return user


class LoginSerializer(serializers.Serializer[UserModel]):
    """
    Serializer for user login.

    Validates the credentials (username/email and password) and returns the authenticated user
    along with a token.
    """

    email = serializers.EmailField(required=False)
    username = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True)

    def validate(self, data: Dict[str, Union[str, Any]]) -> Dict[str, Union[str, Any]]:
        """
        Validate the login credentials.

        If no email is provided, the login will attempt to use the username.
        If a user is found and authenticated, a token is generated.

        Parameters
        ----------
        data : Dict[str, Union[str, Any]]
            Data to validate.

        Returns
        -------
        Dict[str, Union[str, Any]]
            Returns the validated data.
        """

        if not data.get("email"):
            user = UserModel.objects.filter(username=data.get("username")).first()
        else:
            user = UserModel.objects.filter(email=data.get("email")).first()

        if user is None:
            raise serializers.ValidationError(
                ("Invalid credentials. Please try again."),
                code="invalid_credentials",
            )

        authenticated_user: UserModel = authenticate(
            username=user,
            password=data.get("password"),
        )  # type: ignore

        if authenticated_user is None:
            raise serializers.ValidationError(
                ("Invalid credentials. Please try again."),
                code="invalid_credentials",
            )

        if authenticated_user.email != "" and authenticated_user.is_confirmed is False:
            raise serializers.ValidationError(
                ("Please confirm your email address."),
                code="email_not_confirmed",
            )

        data["user"] = authenticated_user

        token, _ = Token.objects.get_or_create(user=user)
        data["token"] = token.key
        data["user"] = user

        return data


class PasswordResetSerializer(serializers.Serializer[UserModel]):
    """
    Serializer for password reset.

    Either an email or a verification code can be provided to reset the password.
    If the verification code is valid, the password can be reset.
    """

    email = serializers.EmailField(required=False)
    password = serializers.CharField(write_only=True)
    code = serializers.UUIDField(required=False)

    def validate(self, data: Dict[str, Union[str, Any]]) -> UserModel:
        """
        Validate the email or verification code provided for password reset.

        If the code is provided, it checks for a matching code. If only the email is provided,
        it checks if the email exists in the system.

        Parameters
        ----------
        data : Dict[str, Union[str, Any]]
            Data to validate.

        Returns
        -------
        UserModel
            Returns the validated data.
        """
        if data.get("code") is not None:
            user = UserModel.objects.filter(verification_code=data.get("code")).first()
        else:
            user = UserModel.objects.filter(email=data.get("email")).first()

        if user is None:
            raise serializers.ValidationError(
                _("Invalid email address. Please try again."),
                code="invalid_email",
            )

        return user
