import re
from rest_framework import serializers

def validate_creation_and_deletion_dates(data):

    if not re.match(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$", data["creation_date"]):
        raise serializers.ValidationError(
            "the creation date needs to be in ISO format"
        )

    if data["creation_date"] < data["deletion_date"]:
        raise serializers.ValidationError(
            "creation_date must be before deletion_date"
        )

def validate_creation_and_deprecation_dates(data):
    if data["deprecation_date"] < data["creation_date"]:
        raise serializers.ValidationError(
            "deprecation_date cannot be before creation_date"
        )

def validate_flags_number(data):
    
    if int(data["total_flags"]) < 0:
        raise serializers.ValidationError(
            "total_flags cannot be negative"
        )

def validate_empty(value, field_name):
    if value == "" or value is None:
        raise serializers.ValidationError(
            field_name + " cannot be empty"
        )
