from rest_framework import serializers

from .models import *


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

class OrganizationEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationEvent
        fields = (
            "org_id",
            "event_id",
        )


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
        
