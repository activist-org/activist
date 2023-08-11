from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField
from django.db import models


class Support(models.Model):
    index = models.IntegerField
    supporter_type = models.IntegerField
    supporter_entity = models.IntegerField
    supported_type = models.IntegerField
    supported_entity = models.IntegerField
# Create your models here.
# New user model
class User(AbstractUser):
    password = models.CharField(max_length=255)
    location = models.CharField(max_length=30, null=True)
    description = models.TextField(max_length=500, null=True)
    verified = models.BooleanField(default=False)
    verification_method = models.CharField(max_length=30, null=True)
    verification_partner = models.ForeignKey(
        Support, on_delete=models.CASCADE, null=True
    )
    social_accounts = ArrayField(models.CharField(max_length=255), null=True)
    total_flags = models.IntegerField(default=0)
    deletion_date = models.DateField(null=True)
    creation_date = models.DateField(auto_now_add=True)

    class Meta:
        verbose_name = "user"
        verbose_name_plural = "2. Users"

    def __str__(self):
        return self.username


class Organization(models.Model):
    name = models.CharField(max_length=255)
    tagline = models.CharField(max_length=255)
    application_id: models.IntegerField
    social_accounts: ArrayField(models.CharField(max_length=255))
    total_flags: models.IntegerField
    created_by: models.IntegerField
    creation_date: models.DateField

    class Meta:
        verbose_name = "organization"
        verbose_name_plural = "2. Organizations"

    def __str__(self):
        return self.name


class Event(models.Model):
    creation_date = models.DateField
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    tagline = models.CharField(max_length=255)
    start_time = models.DateField
    end_time = models.DateField
    type = models.CharField(max_length=255)
    format = models.CharField(max_length=255)
    online_location_link = models.CharField(max_length=255)
    offline_location_name = models.CharField(max_length=255)
    offline_location_lat = models.FloatField
    offline_location_long = models.FloatField
    description = models.TextField(max_length=500)
    get_involved_text = models.TextField(max_length=500)
    deletion_date = models.DateField


class Role(models.Model):
    name = models.CharField(max_length=255)
    is_custom = models.BooleanField
    creation_date = models.DateField
    description = models.TextField(max_length=500)
    last_updated = models.DateField
    deprecation_date = models.DateField

    class Meta:
        verbose_name = "role"
        verbose_name_plural = "1. Role"

    def __str__(self):
        return self.name


class Topic(models.Model):
    name = models.CharField(max_length=255)
    active = models.BooleanField
    creation_date = models.DateField
    description = models.TextField(max_length=500)
    last_updated = models.DateField
    deprecation_date = models.DateField

    class Meta:
        verbose_name = "topic"
        verbose_name_plural = "1. Topic"

    def __str__(self):
        return self.name


class Resource(models.Model):
    name = models.CharField(max_length=255)
    topics = ArrayField(models.CharField(max_length=255))
    location = models.CharField(max_length=255)
    url = models.CharField(max_length=255)
    total_flags = models.IntegerField
    creation_date = models.DateField
    description = models.TextField(max_length=500)
    last_updated = models.DateField
    deletion_date = models.DateField

    class Meta:
        verbose_name = "resource"
        verbose_name_plural = "1. Resource"

    def __str__(self):
        return self.name


class Format(models.Model):
    name = models.CharField(max_length=255)
    creation_date = models.DateField
    description = models.TextField(max_length=500)
    last_updated = models.DateField
    deprecation_date = models.DateField

    class Meta:
        verbose_name = "format"
        verbose_name_plural = "1. Format"

    def __str__(self):
        return self.name


class Group(models.Model):
    name = models.CharField(max_length=255)
    creation_date = models.DateField
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField(max_length=500)
    tagline = models.CharField(max_length=255)
    total_flags = models.IntegerField
    social_accounts = ArrayField(models.CharField(max_length=255))
    deletion_date = models.DateField

    class Meta:
        verbose_name = "group"
        verbose_name_plural = "1. Group"

    def __str__(self):
        return self.name


class Task(models.Model):
    name = models.CharField(max_length=255)
    creation_date = models.DateField
    description = models.TextField(max_length=500)
    tags = ArrayField(models.CharField(max_length=255))
    location = models.CharField(max_length=255)
    deletion_date = models.DateField

    class Meta:
        verbose_name = "task"
        verbose_name_plural = "1. Task"

    def __str__(self):
        return self.name





class SupportEntityTypes(models.Model):
    name = models.CharField(max_length=255)
    type = models.ForeignKey(Support, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "support entity type"
        verbose_name_plural = "1. Support Entity Type"

    def __str__(self):
        return self.name


class UserResource(models.Model):
    index = models.IntegerField
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    resource_id = models.ForeignKey(Resource, on_delete=models.CASCADE)

    def __str__(self):
        return self.index


class UserTopic(models.Model):
    index = models.IntegerField
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    topic_id = models.ForeignKey(Topic, on_delete=models.CASCADE)

    def __str__(self):
        return self.index


class UserTask(models.Model):
    index = models.IntegerField
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    task_id = models.ForeignKey(Task, on_delete=models.CASCADE)

    def __str__(self):
        return self.index


class GroupMember(models.Model):
    index = models.IntegerField
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.index


class GroupResource(models.Model):
    index = models.IntegerField
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE)
    resource_id = models.ForeignKey(Resource, on_delete=models.CASCADE)

    def __str__(self):
        return self.index


class GroupTopic(models.Model):
    index = models.IntegerField
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE)
    topic_id = models.ForeignKey(Topic, on_delete=models.CASCADE)

    def __str__(self):
        return self.index


class GroupEvent(models.Model):
    index = models.IntegerField
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE)
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)

    def __str__(self):
        return self.index


class EventResource(models.Model):
    index = models.IntegerField
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    resource_id = models.ForeignKey(Resource, on_delete=models.CASCADE)

    def __str__(self):
        return self.index


class EventRole(models.Model):
    index = models.IntegerField
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    role_id = models.ForeignKey(Role, on_delete=models.CASCADE)

    def __str__(self):
        return self.index


class EventTopic(models.Model):
    index = models.IntegerField
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    topic_id = models.ForeignKey(Topic, on_delete=models.CASCADE)

    def __str__(self):
        return self.index


class EventAttendee(models.Model):
    index = models.IntegerField
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    role_id = models.ForeignKey(Role, on_delete=models.CASCADE)
    attendee_status = models.IntegerField


class EventAttendeeStatus(models.Model):
    status = models.IntegerField
    status_name = models.CharField(max_length=255)

    def __str__(self):
        return self.status_name


class EventTask(models.Model):
    index = models.IntegerField
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    task_id = models.ForeignKey(Task, on_delete=models.CASCADE)

    def __str__(self):
        return self.index


class TopicFormat(models.Model):
    index: models.IntegerField
    topic_id: models.ForeignKey(Topic, on_delete=models.CASCADE)
    format_id: models.ForeignKey(Format, on_delete=models.CASCADE)

    def __str__(self):
        return self.index


class ResourceTopic(models.Model):
    index: models.IntegerField
    resource_id: models.ForeignKey(Resource, on_delete=models.CASCADE)
    topic_id: models.ForeignKey(Topic, on_delete=models.CASCADE)

    def __str__(self):
        return self.index


class OrganizationApplicationStatus(models.Model):
    status: models.IntegerField
    status_name: models.CharField(max_length=255)

    def __str__(self):
        return self.status_name


class OrganizationApplication(models.Model):
    creation_date: models.DateField
    status = models.ForeignKey(OrganizationApplicationStatus, on_delete=models.CASCADE)
    status_updated: models.DateField
    org_id = models.IntegerField
    orgs_in_favor: ArrayField(models.IntegerField)
    orgs_against: ArrayField(models.IntegerField)

    def __str__(self):
        return self.creation_date


class OrganizationResource(models.Model):
    index: models.IntegerField
    org_id: models.ForeignKey(Organization, on_delete=models.CASCADE)

    def __str__(self):
        return self.index


class OrganizationMember(models.Model):
    index: models.IntegerField
    org_id: models.ForeignKey(Organization, on_delete=models.CASCADE)
    user_id: models.ForeignKey(User, on_delete=models.CASCADE)
    is_owner: models.BooleanField
    is_admin: models.BooleanField
    is_comms: models.BooleanField


class OrganizationTopic(models.Model):
    index: models.IntegerField
    org_id: models.ForeignKey(Organization, on_delete=models.CASCADE)
    topic_id: models.ForeignKey(Topic, on_delete=models.CASCADE)


class OrganizationEvent(models.Model):
    index = models.IntegerField
    org_id: models.ForeignKey(Organization, on_delete=models.CASCADE)
    event_id: models.ForeignKey(Event, on_delete=models.CASCADE)


class OrganizationTask(models.Model):
    index = models.IntegerField
    org_id: models.ForeignKey(Organization, on_delete=models.CASCADE)
    task_id: models.ForeignKey(Task, on_delete=models.CASCADE)
