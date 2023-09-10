from rest_framework import serializers
from .models import *
from content.models import Resource, Task, Topic
from events.models import Event
from authentication.models import User
from utils.utils import (
    validate_creation_and_deletion_dates,
    validate_flags_number,
    validate_empty, check_object_existence
)


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = "__all__"

    def validate(self, data):
        validate_empty(data["name"], "name")
        validate_empty(data["tagline"], "tagline")
        validate_empty(data["social_accounts"], "social_accounts")
        validate_flags_number(data)
        validate_creation_and_deletion_dates(data)

        return data


class OrganizationApplicationStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationApplicationStatus
        fields = "__all__"


class OrganizationApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationApplication
        fields = "__all__"

    def validate(self, data):
        validate_empty(data["status"], "status")
        validate_creation_and_deletion_dates(data)
        return data


class OrganizationEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationEvent
        fields = "__all__"

    def validate(self, data):
        if data["org_id"] == "" or data["event_id"] == "":
            raise serializers.ValidationError(
                "org_id and event_id cannot be empty, they must be filled so that the event can be added to the organization"
            )

        return data


class OrganizationMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationMember
        fields = "__all__"

        def validate(self, data):
            if (
                data["is_owner"] == False
                and data["is_admin"] == False
                and data["is_comms"] == False
            ):
                raise serializers.ValidationError(
                    "member has to be at least one of the following: owner, admin or comms"
                )

            if data["org_id"] == "" or data["user_id"] == "":
                raise serializers.ValidationError(
                    "org_id and user_id cannot be empty, they must be filled so that the user can be added to the organization"
                )

            return data


class OrganizationResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationResource
        fields = "__all__"

    def validate(self, data):



        if Organization.objects.filter(id=data["org_id"]).count() == 0:
            raise serializers.ValidationError("org_id does not exist")

        if Resource.objects.filter(id=data["resource_id"]).count() == 0:
            raise serializers.ValidationError("resource_id does not exist")


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"

    def validate(self, data):
        validate_empty(data["name"], "name")
        validate_empty(data["tagline"], "tagline")
        validate_empty(data["social_accounts"], "social_accounts")
        validate_empty(data["created_by"], "created_by")
        validate_flags_number(data)
        validate_creation_and_deletion_dates(data)

        return data

class OrganizationTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationTask
        fields = "__all__"

    def validate(self, data):

        check_object_existence(Organization, data["org_id"], "org_id does not exist")

        check_object_existence(Task, data["task_id"], "task_id does not exist")

        check_object_existence(Group, data["group_id"], "group_id does not exist")

        return data


class OrganizationTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationTopic
        fields = "__all__"

    def validate(self, data):

        check_object_existence(Organization, data["org_id"], "org_id does not exist")

        check_object_existence(Topic, data["topic_id"], "topic_id does not exist")

        return data


class GroupEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupEvent
        fields = "__all__"

    def validate(self, data):

        check_object_existence(Group, data["group_id"], "group_id does not exist")

        check_object_existence(Event, data["event_id"], "event_id does not exist")

        return data


class GroupMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupMember
        fields = "__all__"

    def validate(self, data):

        check_object_existence(Group, data["group_id"], "group_id does not exist")

        check_object_existence(User, data["user_id"], "user_id does not exist")
       
        return data


class GroupResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupResource
        fields = "__all__"

    def validate(self, data):

        check_object_existence(Group, data["group_id"], "group_id does not exist")

        check_object_existence(Resource, data["resource_id"], "resource_id does not exist")

        return data


class GroupTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupTopic
        fields = "__all__"

    def validate(self, data):

        check_object_existence(Group, data["group_id"], "group_id does not exist")

        check_object_existence(Topic, data["topic_id"], "topic_id does not exist")

        return data
