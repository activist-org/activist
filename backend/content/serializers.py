from rest_framework import serializers
from .models import *

class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = (
            "id",
            "name",
            "description",
            "topics",
            "location",
            "url",
            "total_flags",
            "creation_date",
            "last_updated",
            "deletion_date",
        )

        def validate(self, data):
            if data["name"] == "":
                raise serializers.ValidationError(
                    "name cannot be empty"
                )

            if data["description"] == "":
                raise serializers.ValidationError(
                    "description cannot be empty"
                )
            
            if type(data["total_flags"]) != int:
                data["total_flags"] =  int(data["total_flags"])

            if data["creation_date"] < data["deletion_date"]:
                raise serializers.ValidationError(
                    "creation_date must be before deletion_date"
                )
                
            return data

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = (
            "id",
            "name",
            "description",
            "location",
            "tags",
            "creation_date",
            "deletion_date",
        )

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = (
            "id",
            "name",
            "active",
            "description",
            "creation_date",
            "last_updated",
            "deprecation_date",
        )

class ResourceTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceTopic
        fields = (
            "resource_id",
            "topic_id",
        )

class TopicFormatSerializer(serializers.ModelSerializer):
    class Meta:
        model = TopicFormat
        fields = (
            "topic_id",
            "format_id",
        )
