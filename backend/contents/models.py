from django.db import models

import uuid

class Topic(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    active = models.BooleanField(null=True)
    description = models.TextField(max_length=500)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    deprecation_date = models.DateField(null=True)

    def __str__(self):
        return self.name


class TopicFormat(models.Model):
    topic_id = models.ForeignKey(Topic, on_delete=models.CASCADE)
    #format_id = models.ForeignKey(Format, on_delete=models.CASCADE)

    def __str__(self):
        return self.id


class Resource(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    #topics = ArrayField(models.CharField(max_length=255))
    location = models.CharField(max_length=255)
    url = models.CharField(max_length=255)
    total_flags = models.IntegerField(null=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    deletion_date = models.DateField(null=True)

    def __str__(self):
        return self.name


class ResourceTopic(models.Model):
    resource_id = models.ForeignKey(Resource, on_delete=models.CASCADE)
    topic_id = models.ForeignKey(Topic, on_delete=models.CASCADE)

    def __str__(self):
        return self.id


class Task(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    location = models.CharField(max_length=255)
    #tags = ArrayField(models.CharField(max_length=255))
    creation_date = models.DateTimeField(auto_now_add=True)
    deletion_date = models.DateField(null=True)

    def __str__(self):
        return self.name