import re
from typing import Any, Dict, Union

from django.utils.translation import gettext as _
from rest_framework import serializers
from rest_framework.response import Response

from content.models import Resource, Task, Topic
from utils.utils import (
    validate_creation_and_deletion_dates,
    validate_empty,
    validate_object_existence,
)

from .models import Support, SupportEntityType, User, UserResource, UserTask, UserTopic


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


class UserSerializer(serializers.ModelSerializer[User]):
    class Meta:
        model = User
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, Any]]) -> Dict[str, Union[str, Any]]:
        validate_empty(data["password"], "password")
        validate_empty(data["name"], "name")
        validate_empty(data["user_name"], "user_name")

        pattern = r"^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$"

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
        validate_object_existence(User, data["user_id"])
        validate_object_existence(Resource, data["resource_id"])

        return data


class UserTaskSerializer(serializers.ModelSerializer[UserTask]):
    class Meta:
        model = UserTask
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        validate_object_existence(User, data["user_id"])
        validate_object_existence(Task, data["task_id"])

        return data


class UserTopicSerializer(serializers.ModelSerializer[UserTopic]):
    class Meta:
        model = UserTopic
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        validate_object_existence(User, data["user_id"])
        validate_object_existence(Topic, data["topic_id"])

        return data


class SignupSerializer(serializers.ModelSerializer[User]):
    password_confirmed = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("user_name", "password", "password_confirmed")

    def validate(self, data: Dict[str, Union[str, Any]]) -> Dict[str, Union[str, Any]]:
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

    def create(self, validated_data: Dict[str, Union[str, Any]]) -> Response:
        user = User(
            username=validated_data["user_name"], password=validated_data["password"]
        )

        user.user_name = validated_data["user_name"]
        user.save()

        return user
