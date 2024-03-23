from typing import Dict, Union

from django.utils.translation import gettext as _
from rest_framework import serializers

from authentication.models import User
from content.models import Resource, Task, Topic
from events.models import Event
from utils.utils import (
    validate_creation_and_deletion_dates,
    validate_empty,
    validate_flags_number,
    validate_object_existence,
)

from .models import (
    Group,
    GroupEvent,
    GroupMember,
    GroupResource,
    GroupTopic,
    Organization,
    OrganizationApplication,
    # OrganizationApplicationStatus,
    OrganizationEvent,
    OrganizationMember,
    OrganizationResource,
    OrganizationTask,
    OrganizationTopic,
    Status,
    StatusType,
)


class OrganizationSerializer(serializers.ModelSerializer[Organization]):
    class Meta:
        model = Organization
        extra_kwargs = {
            "created_by": {"read_only": True},
            "social_accounts": {"required": False},
            "status_updated": {"read_only": True},
            "acceptance_date": {"read_only": True},
        }
        fields = [
            "id",
            "name",
            "tagline",
            "org_icon",
            "about_images",
            "created_by",
            "description",
            "social_accounts",
            "high_risk",
            # "status",
            # "status_updated",
            "acceptance_date",
        ]


# class OrganizationApplicationStatusSerializer(
#     serializers.ModelSerializer[OrganizationApplicationStatus]
# ):
#     class Meta:
#         model = OrganizationApplicationStatus
#         fields = "__all__"


class OrganizationApplicationSerializer(
    serializers.ModelSerializer[OrganizationApplication]
):
    class Meta:
        model = OrganizationApplication
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        validate_empty(data["status"], "status")
        validate_object_existence(Organization, data["org_id"])

        return data


class OrganizationEventSerializer(serializers.ModelSerializer[OrganizationEvent]):
    class Meta:
        model = OrganizationEvent
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        if data["org_id"] == "" or data["event_id"] == "":
            raise serializers.ValidationError(
                _(
                    "The fields org_id and event_id cannot be empty. They must be filled so that the event can be added to the organization."
                ),
                code="invalid_value",
            )

        validate_object_existence(Organization, data["org_id"])
        validate_object_existence(Event, data["event_id"])

        return data


class OrganizationMemberSerializer(serializers.ModelSerializer[OrganizationMember]):
    class Meta:
        model = OrganizationMember
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        if data["org_id"] == "" or data["user_id"] == "":
            raise serializers.ValidationError(
                _(
                    "The fields org_id and user_id cannot be empty. They must be filled so that the user can be added to the organization."
                ),
                code="invalid_value",
            )

        validate_object_existence(Organization, data["org_id"])
        validate_object_existence(User, data["user_id"])

        return data


class OrganizationResourceSerializer(serializers.ModelSerializer[OrganizationResource]):
    class Meta:
        model = OrganizationResource
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        validate_object_existence(Organization, data["org_id"])
        validate_object_existence(Resource, data["resource_id"])

        return data


class GroupSerializer(serializers.ModelSerializer[Group]):
    class Meta:
        model = Group
        fields = "__all__"



class OrganizationTaskSerializer(serializers.ModelSerializer[OrganizationTask]):
    class Meta:
        model = OrganizationTask
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        validate_object_existence(Organization, data["org_id"])
        validate_object_existence(Task, data["task_id"])
        validate_object_existence(Group, data["group_id"])

        return data


class OrganizationTopicSerializer(serializers.ModelSerializer[OrganizationTopic]):
    class Meta:
        model = OrganizationTopic
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        validate_object_existence(Organization, data["org_id"])
        validate_object_existence(Topic, data["topic_id"])

        return data


class GroupEventSerializer(serializers.ModelSerializer[GroupEvent]):
    class Meta:
        model = GroupEvent
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        validate_object_existence(Group, data["group_id"])
        validate_object_existence(Event, data["event_id"])

        return data


class GroupMemberSerializer(serializers.ModelSerializer[GroupMember]):
    class Meta:
        model = GroupMember
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        validate_object_existence(Group, data["group_id"])
        validate_object_existence(User, data["user_id"])

        return data


class GroupResourceSerializer(serializers.ModelSerializer[GroupResource]):
    class Meta:
        model = GroupResource
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        validate_object_existence(Group, data["group_id"])
        validate_object_existence(Resource, data["resource_id"])

        return data


class GroupTopicSerializer(serializers.ModelSerializer[GroupTopic]):
    class Meta:
        model = GroupTopic
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        validate_object_existence(Group, data["group_id"])
        validate_object_existence(Topic, data["topic_id"])

        return data


class StatusSerializer(serializers.ModelSerializer[Status]):
    class Meta:
        model = Status
        fields = "__all__"


class StatusTypeSerializer(serializers.ModelSerializer[StatusType]):
    class Meta:
        model = StatusType
        fields = "__all__"
