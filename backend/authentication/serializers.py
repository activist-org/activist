from rest_framework import serializers
from .models import *
from utils.utils import validate_creation_and_deletion_dates
class SupportEntityTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportEntityType
        fields = ("id", "name")

    def validate(self, data):
        if data["name"] == "":
            raise serializers.ValidationError(
                "name cannot be empty"
            )
        
        if len(data["name"]) < 3:
            raise serializers.ValidationError(
                "name must be at least 3 characters long"
            )
        return data
class SupportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Support
        fields = (
            "supporter_type",
            "supporter_entity",
            "supported_type",
            "supported_entity",
        )

    def validate(self, data):
        
        if data["supporter_type"] == data["supported_type"]:
            raise serializers.ValidationError(
                "supporter_type and supported_type cannot be the same"
            )
        
        if data["supporter_entity"] == data["supported_entity"]:
            raise serializers.ValidationError(
                "supporter_entity and supported_entity cannot be the same"
            )
        
        return data

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "name",
            "password",
            "location",
            "description",
            "verified",
            "verification_method",
            "verification_partner",
            "social_accounts",
            "total_flags",
            "creation_date",
            "deletion_date",
        )

    def validate(self, data):
        if data["password"] == "" or data["name"] == "" or data["user_name"] == "":
            raise serializers.ValidationError(
                "password, name and user_name cannot be empty"
            )
        
        data = validate_creation_and_deletion_dates(data)

        return data
class UserResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserResource
        fields = (
            "user_id",
            "resource_id",
        )

class UserTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTask
        fields = (
            "user_id",
            "task_id",
        )

class UserTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTopic
        fields = (
            "user_id",
            "topic_id",
        )
