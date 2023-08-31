from django.db import models

import uuid

class Organization(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    tagline = models.CharField(max_length=255)
    #social_accounts = ArrayField(models.CharField(max_length=255))
    total_flags = models.IntegerField(null=True)
    #created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    creation_date = models.DateTimeField(auto_now_add=True)
    deletion_date = models.DateField(null=True)

    def __str__(self):
        return self.name


class OrganizationApplication(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    org_id = models.IntegerField(null=True)
    #status = models.ForeignKey(OrganizationApplicationStatus, on_delete=models.CASCADE)
    #orgs_in_favor = ArrayField(models.IntegerField)
    #orgs_against = ArrayField(models.IntegerField)
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
    #event_id = models.ForeignKey(Event, on_delete=models.CASCADE)

    def __str__(self):
        return self.id


class OrganizationMember(models.Model):
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    #user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    is_owner = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_comms = models.BooleanField(default=False)

    def __str__(self):
        return self.id


class OrganizationResource(models.Model):
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    #resource_id = models.ForeignKey(Resource, on_delete=models.CASCADE)

    def __str__(self):
        return self.id


class OrganizationTask(models.Model):
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    #task_id = models.ForeignKey(Task, on_delete=models.CASCADE)
    #group_id = models.ForeignKey(Task, on_delete=models.CASCADE)

    def __str__(self):
        return self.id


class OrganizationTopic(models.Model):
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    #topic_id = models.ForeignKey(Topic, on_delete=models.CASCADE)

    def __str__(self):
        return self.id


class Group(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    tagline = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    #social_accounts = ArrayField(models.CharField(max_length=255))
    total_flags = models.IntegerField(null=True)
    #created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    creation_date = models.DateTimeField(auto_now_add=True)
    deletion_date = models.DateField(null=True)

    def __str__(self):
        return self.name


class GroupEvent(models.Model):
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE)
    #event_id = models.ForeignKey(Event, on_delete=models.CASCADE)

    def __str__(self):
        return self.id


class GroupMember(models.Model):
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE)
    #user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    is_admin = models.BooleanField(null=False)

    def __str__(self):
        return self.id


class GroupResource(models.Model):
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE)
    #resource_id = models.ForeignKey(Resource, on_delete=models.CASCADE)

    def __str__(self):
        return self.id


class GroupTopic(models.Model):
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE)
    #topic_id = models.ForeignKey(Topic, on_delete=models.CASCADE)

    def __str__(self):
        return self.id