from rest_framework import serializers

from .models import *

class SupportEntityTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportEntityType
        fields = ("id", "name")

class SupportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Support
        fields = (
            "supporter_type",
            "supporter_entity",
            "supported_type",
            "supported_entity",
        )

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
