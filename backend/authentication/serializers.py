from rest_framework import serializers
from .models import *
import re

class SupportEntityTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportEntityType
        fields = ("id", "name")

    def validate(self, data):
        if data["name"] == "":
            raise serializers.ValidationError(
                "name cannot be empty"
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
        if data["supporter_type"] == "":
            raise serializers.ValidationError(
                "supporter_type cannot be empty"
            )

        if data["supporter_entity"] == "":
            raise serializers.ValidationError(
                "supporter_entity cannot be empty"
            )

        if data["supported_type"] == "":
            raise serializers.ValidationError(
                "supported_type cannot be empty"
            )

        if data["supported_entity"] == "":
            raise serializers.ValidationError(
                "supported_entity cannot be empty"
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
        
        creation_date = data["creation_date"]

        if not re.match(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$", creation_date):
            raise serializers.ValidationError(
                "the creation date needs to be in ISO format"
            )

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
