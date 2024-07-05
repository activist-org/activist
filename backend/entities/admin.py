from django.contrib import admin

from .models import (
    Group,
    GroupEvent,
    GroupImage,
    GroupMember,
    GroupResource,
    GroupText,
    GroupTopic,
    Organization,
    OrganizationApplication,
    OrganizationEvent,
    OrganizationImage,
    OrganizationMember,
    OrganizationResource,
    OrganizationTask,
    OrganizationText,
    OrganizationTopic,
    StatusType,
)

# MARK: Main Tables

admin.site.register(Group)
admin.site.register(Organization)

# MARK: Bridge Tables

admin.site.register(GroupEvent)
admin.site.register(GroupImage)
admin.site.register(GroupMember)
admin.site.register(GroupResource)
admin.site.register(GroupText)
admin.site.register(GroupTopic)

admin.site.register(OrganizationApplication)
admin.site.register(OrganizationEvent)
admin.site.register(OrganizationImage)
admin.site.register(OrganizationMember)
admin.site.register(OrganizationResource)
admin.site.register(OrganizationTask)
admin.site.register(OrganizationText)
admin.site.register(OrganizationTopic)

admin.site.register(StatusType)
