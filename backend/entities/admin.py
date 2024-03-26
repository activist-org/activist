from django.contrib import admin

from .models import (
    Group,
    GroupEvent,
    GroupMember,
    GroupResource,
    GroupTopic,
    Organization,
    OrganizationApplication,
    OrganizationEvent,
    OrganizationMember,
    OrganizationResource,
    OrganizationTask,
    OrganizationTopic,
    StatusEntityType,
)

admin.site.register(Group)
admin.site.register(GroupEvent)
admin.site.register(GroupMember)
admin.site.register(GroupResource)
admin.site.register(GroupTopic)
admin.site.register(Organization)
admin.site.register(OrganizationApplication)
admin.site.register(OrganizationEvent)
admin.site.register(OrganizationMember)
admin.site.register(OrganizationResource)
admin.site.register(OrganizationTask)
admin.site.register(OrganizationTopic)
admin.site.register(StatusEntityType)
