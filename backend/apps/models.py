import uuid
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField
from django.db import models

"""
Considerations:

- Every field without a default value has been temporarily set to null=True.
- Fields "creation_date" and "last_updated" have been standardized so that Django manages them automatically:
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
- All fields have on_delete=models.CASCADE: this needs to be reviewed, as SET_NULL is preferable in many cases.
- More comments should be added to improve the readability and understanding of the code.
"""


class Support(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    index = models.IntegerField(null=True)
    supporter_type = models.IntegerField(null=True)
    supporter_entity = models.IntegerField(null=True)
    supported_type = models.IntegerField(null=True)
    supported_entity = models.IntegerField(null=True)

    def __str__(self):
        return self.index


# New user model
class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
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

    creation_date = models.DateTimeField(auto_now_add=True)
    deletion_date = models.DateField(null=True)

    class Meta:
        verbose_name = "user"
        verbose_name_plural = "2. Users"

    def __str__(self):
        return self.username


class Organization(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    tagline = models.CharField(max_length=255)
    application_id: models.IntegerField(null=True)
    social_accounts: ArrayField(models.CharField(max_length=255))
    total_flags: models.IntegerField(null=True)
    created_by: models.IntegerField(null=True)

    creation_date: models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "organization"
        verbose_name_plural = "2. Organizations"

    def __str__(self):
        return self.name


class Event(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    tagline = models.CharField(max_length=255)
    type = models.CharField(max_length=255)
    format = models.CharField(max_length=255)
    online_location_link = models.CharField(max_length=255)
    offline_location_name = models.CharField(max_length=255)
    offline_location_lat = models.FloatField(null=True)
    offline_location_long = models.FloatField(null=True)
    description = models.TextField(max_length=500)
    get_involved_text = models.TextField(max_length=500)

    creation_date = models.DateTimeField(auto_now_add=True)
    deletion_date = models.DateField(null=True)
    start_time = models.DateField(null=True)
    end_time = models.DateField(null=True)

    def __str__(self):
        return self.name


class Role(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    is_custom = models.BooleanField(null=True)
    description = models.TextField(max_length=500)

    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    deprecation_date = models.DateField(null=True)

    class Meta:
        verbose_name = "role"
        verbose_name_plural = "1. Role"

    def __str__(self):
        return self.name


class Topic(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    active = models.BooleanField(null=True)
    description = models.TextField(max_length=500)

    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    deprecation_date = models.DateField(null=True)

    class Meta:
        verbose_name = "topic"
        verbose_name_plural = "1. Topic"

    def __str__(self):
        return self.name


class Resource(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    topics = ArrayField(models.CharField(max_length=255))
    location = models.CharField(max_length=255)
    url = models.CharField(max_length=255)
    total_flags = models.IntegerField(null=True)
    description = models.TextField(max_length=500)

    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    deletion_date = models.DateField(null=True)

    class Meta:
        verbose_name = "resource"
        verbose_name_plural = "1. Resource"

    def __str__(self):
        return self.name


class Format(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=500)

    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    deprecation_date = models.DateField(null=True)

    class Meta:
        verbose_name = "format"
        verbose_name_plural = "1. Format"

    def __str__(self):
        return self.name


class Group(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField(max_length=500)
    tagline = models.CharField(max_length=255)
    total_flags = models.IntegerField(null=True)
    social_accounts = ArrayField(models.CharField(max_length=255))

    creation_date = models.DateTimeField(auto_now_add=True)
    deletion_date = models.DateField(null=True)

    class Meta:
        verbose_name = "group"
        verbose_name_plural = "1. Group"

    def __str__(self):
        return self.name


class Task(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    tags = ArrayField(models.CharField(max_length=255))
    location = models.CharField(max_length=255)

    creation_date = models.DateTimeField(auto_now_add=True)
    deletion_date = models.DateField(null=True)

    class Meta:
        verbose_name = "task"
        verbose_name_plural = "1. Task"

    def __str__(self):
        return self.name


class SupportEntityTypes(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    type = models.ForeignKey(Support, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "support entity type"
        verbose_name_plural = "1. Support Entity Type"

    def __str__(self):
        return self.name


class UserResource(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    index = models.IntegerField(null=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    resource_id = models.ForeignKey(Resource, on_delete=models.CASCADE)

    def __str__(self):
        return self.index


class UserTopic(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    index = models.IntegerField(null=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    topic_id = models.ForeignKey(Topic, on_delete=models.CASCADE)

    def __str__(self):
        return self.index


class UserTask(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    index = models.IntegerField(null=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    task_id = models.ForeignKey(Task, on_delete=models.CASCADE)

    def __str__(self):
        return self.index


class GroupMember(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    index = models.IntegerField(null=True)
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.index


class GroupResource(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    index = models.IntegerField(null=True)
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE)
    resource_id = models.ForeignKey(Resource, on_delete=models.CASCADE)

    def __str__(self):
        return self.index


class GroupTopic(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    index = models.IntegerField(null=True)
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE)
    topic_id = models.ForeignKey(Topic, on_delete=models.CASCADE)

    def __str__(self):
        return self.index


class GroupEvent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    index = models.IntegerField(null=True)
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE)
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)

    def __str__(self):
        return self.index


class EventResource(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    index = models.IntegerField(null=True)
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    resource_id = models.ForeignKey(Resource, on_delete=models.CASCADE)

    def __str__(self):
        return self.index


class EventRole(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    index = models.IntegerField(null=True)
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    role_id = models.ForeignKey(Role, on_delete=models.CASCADE)

    def __str__(self):
        return self.index


class EventTopic(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    index = models.IntegerField(null=True)
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    topic_id = models.ForeignKey(Topic, on_delete=models.CASCADE)

    def __str__(self):
        return self.index


class EventAttendee(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    index = models.IntegerField(null=True)
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    role_id = models.ForeignKey(Role, on_delete=models.CASCADE)
    attendee_status = models.IntegerField(null=True)


class EventAttendeeStatus(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    status = models.IntegerField(null=True)
    status_name = models.CharField(max_length=255)

    def __str__(self):
        return self.status_name


class EventTask(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    index = models.IntegerField(null=True)
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    task_id = models.ForeignKey(Task, on_delete=models.CASCADE)

    def __str__(self):
        return self.index


class TopicFormat(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    index: models.IntegerField(null=True)
    topic_id: models.ForeignKey(Topic, on_delete=models.CASCADE)
    format_id: models.ForeignKey(Format, on_delete=models.CASCADE)

    def __str__(self):
        return self.index


class ResourceTopic(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    index: models.IntegerField(null=True)
    resource_id: models.ForeignKey(Resource, on_delete=models.CASCADE)
    topic_id: models.ForeignKey(Topic, on_delete=models.CASCADE)

    def __str__(self):
        return self.index


class OrganizationApplicationStatus(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    status: models.IntegerField(null=True)
    status_name: models.CharField(max_length=255)

    def __str__(self):
        return self.status_name


class OrganizationApplication(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    status = models.ForeignKey(OrganizationApplicationStatus, on_delete=models.CASCADE)
    org_id = models.IntegerField(null=True)
    orgs_in_favor: ArrayField(models.IntegerField)
    orgs_against: ArrayField(models.IntegerField)

    creation_date: models.DateTimeField(auto_now_add=True)
    status_updated: models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.creation_date


class OrganizationResource(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    index: models.IntegerField(null=True)
    org_id: models.ForeignKey(Organization, on_delete=models.CASCADE)

    def __str__(self):
        return self.index


class OrganizationMember(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    index: models.IntegerField(null=True)
    org_id: models.ForeignKey(Organization, on_delete=models.CASCADE)
    user_id: models.ForeignKey(User, on_delete=models.CASCADE)
    is_owner: models.BooleanField(default=False)
    is_admin: models.BooleanField(default=False)
    is_comms: models.BooleanField(default=False)

    def __str__(self):
        return self.index


class OrganizationTopic(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    index: models.IntegerField(null=True)
    org_id: models.ForeignKey(Organization, on_delete=models.CASCADE)
    topic_id: models.ForeignKey(Topic, on_delete=models.CASCADE)

    def __str__(self):
        return self.index


class OrganizationEvent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    index = models.IntegerField(null=True)
    org_id: models.ForeignKey(Organization, on_delete=models.CASCADE)
    event_id: models.ForeignKey(Event, on_delete=models.CASCADE)

    def __str__(self):
        return self.index


class OrganizationTask(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    index = models.IntegerField(null=True)
    org_id: models.ForeignKey(Organization, on_delete=models.CASCADE)
    task_id: models.ForeignKey(Task, on_delete=models.CASCADE)

    def __str__(self):
        return self.index
