from rest_framework import serializers

from .models import *
from utils.utils import validate_creation_and_deletion_dates, validate_creation_and_deprecation_dates, validate_empty

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

    def validate(self, data):

        required_fields = ["name", "tagline", "type", "description", "get_involved_text", "online_location_link", "offline_location_name", "created_by"]

        def isEmpty():
            for field in required_fields:
                if data[field] == "" or data[field] == None:
                    return True
            return False

        if isEmpty():
            raise serializers.ValidationError(
                "only the offline_location_lat and offline_location_long fields can be empty for Events"
            )
        
        validate_creation_and_deletion_dates(data)

        return data

class FormatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Format
        fields = '__all__'

    def validate(self, data):

        validate_empty(data["name"], "name")
        validate_empty(data["description"], "description")
        validate_creation_and_deprecation_dates(data)
        validate_creation_and_deletion_dates(data)

        return data

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'

        def validate(self, data):

            validate_empty(data["name"], "name")
            validate_empty(data["description"], "description")
            validate_creation_and_deprecation_dates(data)

            return data

class EventAttendeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventAttendee
        fields = '__all__'

    def validate(self, data):

        validate_empty(data["event_id"], "event_id")
        validate_empty(data["user_id"], "user_id")
        validate_empty(data["role_id"], "role_id")
    
        return data


class EventFormatSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventFormat
        fields = '__all__'

class EventAttendeeStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventAttendeeStatus
        fields = '__all__'

class EventResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventResource
        fields = '__all__'


class EventRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventRole
        fields = '__all__'

class EventTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventTask
        fields = '__all__'
class EventTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventTopic
        fields = '__all__'
