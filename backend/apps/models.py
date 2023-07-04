from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField

# Create your models here.
# New user model
class User(AbstractUser):
    bio = models.TextField(max_length=500, null=True)
    location = models.CharField(max_length=30, null=True)
    website = models.CharField(max_length=100, null=True)
    joined_date = models.DateField(auto_now_add=True)
    class Meta:
        verbose_name = 'user'
        verbose_name_plural = '2. Users'
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
        verbose_name = 'organization'
        verbose_name_plural = '2. Organizations'
    def __str__(self):
        return self.name
    
class Event(models.Model):
    creation_date = models.DateField
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)

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

class OrganiZationMember(models.Model):
    index: models.IntegerField
    org_id: models.ForeignKey(Organization, on_delete=models.CASCADE)
    user_id: models.ForeignKey(User, on_delete=models.CASCADE)
    is_owner: models.BooleanField
    is_admin: models.BooleanField
    is_comms: models.BooleanField

class OrganizationTopic(models.Model):
    index: models.IntegerField
    org_id: models.ForeignKey(Organization, on_delete=models.CASCADE)
    topic_id: models.IntegerField # TODO: link foreign key

class OrganizationEvent(models.Model):
    index = models.IntegerField
    org_id: models.ForeignKey(Organization, on_delete=models.CASCADE)
    event_id: models.IntegerField # TODO: link foreign key

            
                                                   





