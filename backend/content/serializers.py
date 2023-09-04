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
