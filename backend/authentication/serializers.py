from rest_framework import serializers
from .models import *
from utils.utils import validate_creation_and_deletion_dates, validate_empty
class SupportEntityTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportEntityType
        fields = '__all__'

    def validate(self, data):
        validate_empty(data["name"], "name")
        if len(data["name"]) < 3:
            raise serializers.ValidationError(
                "name must be at least 3 characters long"
            )
        return data
class SupportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Support
        fields = '__all__'

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
        fields = '__all__'

    def validate(self, data):

        validate_empty(data["password"], "password")
        validate_empty(data["name"], "name")
        validate_empty(data["user_name"], "user_name")
        
        validate_creation_and_deletion_dates(data)

        return data
class UserResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserResource
        fields = '__all__'
class UserTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTask
        fields = '__all__'

class UserTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTopic
        fields = '__all__'
