from rest_framework import serializers
from .models import *
from utils.utils import validate_creation_and_deletion_dates

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
            if data["name"] == "" or data["description"] == "" or data["url"] == "" or data["topics"] == [] or data["location"] == "":
                raise serializers.ValidationError(
                    "the name, description, url, topics and location fields cannot be empty"
                )
            
            if type(data["total_flags"]) != int:
                data["total_flags"] =  int(data["total_flags"])
            
            if data["total_flags"] < 0:
                raise serializers.ValidationError(
                    "total_flags cannot be negative"
                )
            
            if not re.match(r'https?://\S+', data["url"]):
                raise serializers.ValidationError(
                    "url must be a valid url - https://www.example.com"
                )
            
            data = validate_creation_and_deletion_dates(data)
                
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

        def validate(self, data):

            if data["name"] == "" or data["description"] == "":
                raise serializers.ValidationError(
                    "the name, description, location and tags fields cannot be empty"
                )

            data = validate_creation_and_deletion_dates(data)

            return data
             

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

        def validate(self, data):

            if data["name"] == "" or data["description"] == "":
                raise serializers.ValidationError(
                    "the name and description fields cannot be empty"
                )
            
            if data["active"] == True and data["deprecation_date"] != None:
                raise serializers.ValidationError(
                    "active topics cannot have a deprecation date"
                )
            
            if data["active"] == False and data["deprecation_date"] == None:
                raise serializers.ValidationError(
                    "inactive topics must have a deprecation date"
                )
            
            if data["creation_date"] > data["deprecation_date"]:
                raise serializers.ValidationError(
                    "creation_date must be before deprecation_date"
                )

            return data

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
