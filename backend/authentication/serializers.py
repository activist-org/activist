"""
Serializers for the authentication app.
"""

import re
from typing import Any, Dict, Union

from django.contrib.auth import authenticate, get_user_model
from django.utils.translation import gettext as _
from rest_framework import serializers
from rest_framework.authtoken.models import Token

from utils.utils import (
    validate_creation_and_deletion_dates,
)

from .models import (
    Support,
    SupportEntityType,
    UserModel,
    UserResource,
    UserTask,
    UserTopic,
)

USER = get_user_model()


class SupportEntityTypeSerializer(serializers.ModelSerializer[SupportEntityType]):
    class Meta:
        model = SupportEntityType
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, Any]]) -> Dict[str, Union[str, Any]]:
        if len(data["name"]) < 3:
            raise serializers.ValidationError(
                _("The field name must be at least 3 characters long."),
                code="invalid_name",
            )
        return data


class SupportSerializer(serializers.ModelSerializer[Support]):
    class Meta:
        model = Support
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        if data["supporter_entity"] == data["supported_entity"]:
            raise serializers.ValidationError(
                _(
                    "The fields supporter_entity and supported_entity cannot have the same value."
                ),
                code="invalid_entities_relation",
            )

        return data


class UserSerializer(serializers.ModelSerializer[UserModel]):
    class Meta:
        model = UserModel
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, Any]]) -> Dict[str, Union[str, Any]]:
        pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{12,}$"

        if not re.match(pattern, data["password"]):
            raise serializers.ValidationError(
                _(
                    "The field password must be at least 12 characters long and contain at least one special character, one uppercase letter and one lowercase letter, and numbers."
                ),
                code="invalid_password",
            )

        if "creation_date" in data:
            validate_creation_and_deletion_dates(data)

        return data


class UserResourceSerializer(serializers.ModelSerializer[UserResource]):
    class Meta:
        model = UserResource
        fields = "__all__"


class UserTaskSerializer(serializers.ModelSerializer[UserTask]):
    class Meta:
        model = UserTask
        fields = "__all__"


class UserTopicSerializer(serializers.ModelSerializer[UserTopic]):
    class Meta:
        model = UserTopic
        fields = "__all__"


class SignupSerializer(serializers.ModelSerializer[UserModel]):
    password_confirmed = serializers.CharField(write_only=True)

    class Meta:
        model = USER
        fields = ("username", "password", "password_confirmed", "email")
        extra_kwargs = {"password": {"write_only": True}, "email": {"required": False}}

    def validate(self, data: Dict[str, Union[str, Any]]) -> Dict[str, Union[str, Any]]:
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
        validated_data.pop("password_confirmed")

        user: UserModel = UserModel.objects.create_user(**validated_data)
        user.save()

        return user


class LoginSerializer(serializers.Serializer[UserModel]):
    email = serializers.EmailField(required=False)
    username = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True)

    def validate(self, data: Dict[str, Union[str, Any]]) -> Dict[str, Union[str, Any]]:
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
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data: Dict[str, Union[str, Any]]) -> UserModel:
        user = UserModel.objects.filter(email=data.get("email")).first()

        if user is None:
            raise serializers.ValidationError(
                _("Invalid email address. Please try again."),
                code="invalid_email",
            )

        return user
