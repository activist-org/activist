import uuid

from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField
from django.db import models

"""
Considerations:
- All fields have on_delete=models.CASCADE: this needs to be reviewed, as SET_NULL is preferable in many cases.
- More comments should be added to improve the readability and understanding of the code.
"""

# Note: App 1 - Authentication, Users and Support


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_name = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    location = models.CharField(max_length=30, null=True)
    description = models.TextField(max_length=500, null=True)
    verified = models.BooleanField(default=False)
    verification_method = models.CharField(max_length=30, null=True)
    verification_partner = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    social_accounts = ArrayField(models.CharField(max_length=255), null=True)
    total_flags = models.IntegerField(default=0)
    creation_date = models.DateTimeField(auto_now_add=True)
    deletion_date = models.DateField(null=True)

    def __str__(self):
        return self.username


class UserResource(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    resource_id = models.ForeignKey(Resource, on_delete=models.CASCADE)

    def __str__(self):
        return self.id


class UserTask(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    task_id = models.ForeignKey(Task, on_delete=models.CASCADE)

    def __str__(self):
        return self.id


class UserTopic(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    topic_id = models.ForeignKey(Topic, on_delete=models.CASCADE)

    def __str__(self):
        return self.id


class Support(models.Model):
    supporter_type = models.ForeignKey(SupportEntityType, on_delete=models.CASCADE)
    supporter_entity = models.IntegerField(null=True)
    supported_type = models.ForeignKey(SupportEntityType, on_delete=models.CASCADE)
    supported_entity = models.IntegerField(null=True)

    def __str__(self):
        return self.id


class SupportEntityType(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


# Note: App 2 - Organizations, Groups and Movements


class Organization(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    tagline = models.CharField(max_length=255)
    social_accounts = ArrayField(models.CharField(max_length=255))
    total_flags = models.IntegerField(null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    creation_date = models.DateTimeField(auto_now_add=True)
    deletion_date = models.DateField(null=True)

    def __str__(self):
        return self.name


class OrganizationApplication(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    org_id = models.IntegerField(null=True)
    status = models.ForeignKey(OrganizationApplicationStatus, on_delete=models.CASCADE)
    orgs_in_favor = ArrayField(models.IntegerField)
    orgs_against = ArrayField(models.IntegerField)
    creation_date = models.DateTimeField(auto_now_add=True)
    status_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.creation_date


class OrganizationApplicationStatus(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    status_name = models.CharField(max_length=255)

    def __str__(self):
        return self.status_name


class OrganizationEvent(models.Model):
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)

    def __str__(self):
        return self.id


class OrganizationMember(models.Model):
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    is_owner = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_comms = models.BooleanField(default=False)

    def __str__(self):
        return self.id


class OrganizationResource(models.Model):
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    resource_id = models.ForeignKey(Resource, on_delete=models.CASCADE)

    def __str__(self):
        return self.id


class OrganizationTask(models.Model):
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    task_id = models.ForeignKey(Task, on_delete=models.CASCADE)
    group_id = models.ForeignKey(Task, on_delete=models.CASCADE)

    def __str__(self):
        return self.id


class OrganizationTopic(models.Model):
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    topic_id = models.ForeignKey(Topic, on_delete=models.CASCADE)

    def __str__(self):
        return self.id


class Group(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    tagline = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    social_accounts = ArrayField(models.CharField(max_length=255))
    total_flags = models.IntegerField(null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    creation_date = models.DateTimeField(auto_now_add=True)
    deletion_date = models.DateField(null=True)

    def __str__(self):
        return self.name


class GroupEvent(models.Model):
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE)
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)

    def __str__(self):
        return self.id


class GroupMember(models.Model):
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    is_admin = models.BooleanField(null=False)

    def __str__(self):
        return self.id


class GroupResource(models.Model):
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE)
    resource_id = models.ForeignKey(Resource, on_delete=models.CASCADE)

    def __str__(self):
        return self.id


class GroupTopic(models.Model):
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE)
    topic_id = models.ForeignKey(Topic, on_delete=models.CASCADE)

    def __str__(self):
        return self.id


# Note: App 3 - Events, Formats and Roles


class Event(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    tagline = models.CharField(max_length=255)
    type = models.CharField(max_length=255)
    online_location_link = models.CharField(max_length=255)
    offline_location_name = models.CharField(max_length=255)
    offline_location_lat = models.FloatField(null=True)
    offline_location_long = models.FloatField(null=True)
    description = models.TextField(max_length=500)
    get_involved_text = models.TextField(max_length=500)
    start_time = models.DateField(null=True)
    end_time = models.DateField(null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    creation_date = models.DateTimeField(auto_now_add=True)
    deletion_date = models.DateField(null=True)

    def __str__(self):
        return self.name


class EventAttendee(models.Model):
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    role_id = models.ForeignKey(Role, on_delete=models.CASCADE)
    attendee_status = models.IntegerField(null=True)


class EventFormat(models.Model):
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    format_id = models.ForeignKey(Format, on_delete=models.CASCADE)

    def __str__(self):
        return self.id


class EventAttendeeStatus(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    status_name = models.CharField(max_length=255)

    def __str__(self):
        return self.status_name


class EventResource(models.Model):
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    resource_id = models.ForeignKey(Resource, on_delete=models.CASCADE)

    def __str__(self):
        return self.id


class EventRole(models.Model):
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    role_id = models.ForeignKey(Role, on_delete=models.CASCADE)

    def __str__(self):
        return self.id


class EventTask(models.Model):
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    task_id = models.ForeignKey(Task, on_delete=models.CASCADE)

    def __str__(self):
        return self.id


class EventTopic(models.Model):
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    topic_id = models.ForeignKey(Topic, on_delete=models.CASCADE)

    def __str__(self):
        return self.id


class Format(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    deprecation_date = models.DateField(null=True)

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

    def __str__(self):
        return self.name


# Note: App 4 - Topics, Resources and Tasks


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
    format_id = models.ForeignKey(Format, on_delete=models.CASCADE)

    def __str__(self):
        return self.id


class Resource(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    topics = ArrayField(models.CharField(max_length=255))
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
    tags = ArrayField(models.CharField(max_length=255))
    creation_date = models.DateTimeField(auto_now_add=True)
    deletion_date = models.DateField(null=True)

    def __str__(self):
        return self.name
