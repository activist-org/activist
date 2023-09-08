from rest_framework import serializers
from .models import *
from utils.utils import validate_creation_and_deletion_dates

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = (
            "id",
            "name",
            "tagline",
            "social_accounts",
            "total_flags",
            "created_by",
            "creation_date",
            "deletion_date",
        )

    def validate(self, data):

        if data["name"] == "" or data["tagline"] == "" or data["social_accounts"] == []:
            raise serializers.ValidationError(
                "the name, tagline and social_accounts fields cannot be empty"
            )

        if data["total_flags"] < 0:
            raise serializers.ValidationError(
                "total_flags cannot be negative"
            )

        data = validate_creation_and_deletion_dates(data)

        return data


class OrganizationApplicationStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationApplicationStatus
        fields = ("id", "status_name")

class OrganizationApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationApplication
        fields = (
            "id",
            "org_id",
            "status",
            "orgs_in_favor",
            "orgs_against",
            "creation_date",
            "status_updated",
        )

    def validate(self, data):

        if data["status"] == "":
            raise serializers.ValidationError(
                "status cannot be empty"
            )

        data = validate_creation_and_deletion_dates(data)
        return data

class OrganizationEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationEvent
        fields = (
            "org_id",
            "event_id",
        )

    def validate(self, data):
        if data["org_id"] == "" or data["event_id"] == "":
            raise serializers.ValidationError(
                "org_id and event_id cannot be empty, they must be filled so that the event can be added to the organization"
            )
        return data

class OrganizationMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationMember
        fields = (
            "org_id",
            "user_id",
            "is_owner",
            "is_admin",
            "is_comms",
        )

        def validate(self, data):

            if data["is_owner"] == False and data["is_admin"] == False and data["is_comms"] == False:
                raise serializers.ValidationError(
                    "he has to be at least one of the following: owner, admin or comms"
                )

            if data["org_id"] == "" or data["user_id"] == "":
                raise serializers.ValidationError(
                    "org_id and user_id cannot be empty, they must be filled so that the user can be added to the organization"
                )

            return data


class OrganizationResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationResource
        fields = (
            "org_id",
            "resource_id",
        )

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = (
            "id",
            "org_id",
            "name",
            "tagline",
            "description",
            "social_accounts",
            "total_flags",
            "created_by",
            "creation_date",
            "deletion_date",
        )

    def validate(self, data):
            
            if data["name"] == "" or data["tagline"] == "" or data["social_accounts"] == [] or data["created_by"] == "":
                raise serializers.ValidationError(
                    "the name, tagline, social_accounts  and created_by fields cannot be empty"
                )
            
            if int(data["total_flags"]) < 0:
                raise serializers.ValidationError(
                    "total_flags cannot be negative"
                )
    
            data = validate_creation_and_deletion_dates(data)
    
            return data

class OrganizationTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationTask
        fields = (
            "org_id",
            "task_id",
            "group_id",
        )

class OrganizationTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationTopic
        fields = (
            "org_id",
            "topic_id",
        )

class GroupEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupEvent
        fields = (
            "group_id",
            "event_id",
        )

class GroupMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupMember
        fields = (
            "group_id",
            "user_id",
            "is_admin",
        )

class GroupResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupResource
        fields = (
            "group_id",
            "resource_id",
        )

class GroupTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupTopic
        fields = (
            "group_id",
            "topic_id",
        )
        
