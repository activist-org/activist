import re
from typing import Any, Dict, Union

from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.utils.translation import gettext as _
from rest_framework import serializers

from content.models import Resource, Task, Topic
from utils.utils import (
    validate_creation_and_deletion_dates,
    validate_empty,
    validate_object_existence,
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
        validate_empty(data["name"], "name")

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
        validate_empty(data["password"], "password")
        validate_empty(data["user_name"], "user_name")

        pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{12,}$"

        if not re.match(pattern, data["password"]):
            raise serializers.ValidationError(
                _(
                    "The field password must be at least 8 characters long and contain at least one special character."
                ),
                code="invalid_password",
            )

        validate_creation_and_deletion_dates(data)

        return data


class UserResourceSerializer(serializers.ModelSerializer[UserResource]):
    class Meta:
        model = UserResource
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        validate_object_existence(UserModel, data["user_id"])
        validate_object_existence(Resource, data["resource_id"])

        return data


class UserTaskSerializer(serializers.ModelSerializer[UserTask]):
    class Meta:
        model = UserTask
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        validate_object_existence(UserModel, data["user_id"])
        validate_object_existence(Task, data["task_id"])

        return data


class UserTopicSerializer(serializers.ModelSerializer[UserTopic]):
    class Meta:
        model = UserTopic
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        validate_object_existence(UserModel, data["user_id"])
        validate_object_existence(Topic, data["topic_id"])

        return data


class SignupSerializer(serializers.ModelSerializer[User]):
    password_confirmed = serializers.CharField(write_only=True)

    class Meta:
        model = USER
        fields = ("username", "password", "password_confirmed", "email")
        extra_kwargs = {"password": {"write_only": True}}

        def validate(
            self, data: Dict[str, Union[str, Any]]
        ) -> Dict[str, Union[str, Any]]:
            validate_empty(data.get("user_name"), "user_name")
            validate_empty(data.get("password"), "password")
            validate_empty(data.get("password_confirmed"), "password_confirmed")
            # TODO: email validation on the future

            pattern = (
                r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$"
            )

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

    def create(self, validated_data: Dict[str, Union[str, Any]]) -> User:
        validated_data.pop("password_confirmed")

        user = UserModel.objects.create(
            username=validated_data["username"],
            password=validated_data["password"],
        )
        user.save()

        return user
