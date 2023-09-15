from content.models import Resource, Task, Topic
from rest_framework import serializers
import re
from utils.utils import (
    validate_creation_and_deletion_dates,
    validate_object_existence,
    validate_empty,
)
from django.utils.translation import gettext as _

from .models import Support, SupportEntityType, User, UserResource, UserTask, UserTopic


class SupportEntityTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportEntityType
        fields = "__all__"

    def validate(self, data):
        validate_empty(data["name"], "name")

        if len(data["name"]) < 3:
            raise serializers.ValidationError(
                _("Name must be at least 3 characters long."),
                code="invalid_name",
            )
        return data


class SupportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Support
        fields = "__all__"

    def validate(self, data):
        if data["supporter_entity"] == data["supported_entity"]:
            raise serializers.ValidationError(
                _("Supporter and supported entities cannot be the same."),
                code="invalid_entities_relation",
            )

        return data


class UserSerializer(serializers.ModelSerializer[User]):
    class Meta:
        model = User
        fields = "__all__"

    def validate(self, data):
        validate_empty(data["password"], "password")
        validate_empty(data["name"], "name")
        validate_empty(data["user_name"], "user_name")

        pattern = r"^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$"

        if not re.match(pattern, data["password"]):
            raise serializers.ValidationError(
                _(
                    "Password must be at least 8 characters long and contain at least one special character."
                ),
                code="invalid_password",
            )

        validate_creation_and_deletion_dates(data)

        return data


class UserResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserResource
        fields = "__all__"

    def validate(self, data):
        validate_object_existence(User, data["user_id"])
        validate_object_existence(Resource, data["resource_id"])

        return data


class UserTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTask
        fields = "__all__"

    def validate(self, data):
        validate_object_existence(User, data["user_id"])
        validate_object_existence(Task, data["task_id"])

        return data


class UserTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTopic
        fields = "__all__"

    def validate(self, data):
        validate_object_existence(User, data["user_id"])
        validate_object_existence(Topic, data["topic_id"])

        return data
