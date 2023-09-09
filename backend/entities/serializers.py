from rest_framework import serializers
from .models import *
from utils.utils import validate_creation_and_deletion_dates

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = '__all__'

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
        fields = '__all__'

class OrganizationApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationApplication
        fields = '__all__'

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
        fields = '__all__'

    def validate(self, data):
        if data["org_id"] == "" or data["event_id"] == "":
            raise serializers.ValidationError(
                "org_id and event_id cannot be empty, they must be filled so that the event can be added to the organization"
            )
        return data

class OrganizationMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationMember
        fields = '__all__'

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
        fields = '__all__'

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'

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
        fields = '__all__'

class OrganizationTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationTopic
        fields = '__all__'

class GroupEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupEvent
        fields = '__all__'

class GroupMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupMember
        fields = '__all__'

class GroupResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupResource
        fields = '__all__'

class GroupTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupTopic
        fields = '__all__'
