from django.contrib import admin

from .models import (
    Group,
    GroupEvent,
    GroupImage,
    GroupMember,
    GroupResource,
    GroupSocialLink,
    GroupText,
    GroupTopic,
    Organization,
    OrganizationApplication,
    OrganizationDiscussion,
    OrganizationEvent,
    OrganizationGroup,
    OrganizationImage,
    OrganizationMember,
    OrganizationResource,
    OrganizationSocialLink,
    OrganizationTask,
    OrganizationText,
    OrganizationTopic,
    StatusType,
)

# MARK: Bridge Tables

admin.site.register(GroupEvent)
admin.site.register(GroupImage)
admin.site.register(GroupMember)
admin.site.register(GroupResource)
admin.site.register(GroupSocialLink)
admin.site.register(GroupTopic)

admin.site.register(OrganizationApplication)
admin.site.register(OrganizationDiscussion)
admin.site.register(OrganizationEvent)
admin.site.register(OrganizationGroup)
admin.site.register(OrganizationImage)
admin.site.register(OrganizationMember)
admin.site.register(OrganizationResource)
admin.site.register(OrganizationSocialLink)
admin.site.register(OrganizationTask)
admin.site.register(OrganizationTopic)

admin.site.register(StatusType)

# MARK: Methods


class GroupAdmin(admin.ModelAdmin[Group]):
    list_display = ["group_name", "name"]


class GroupTextAdmin(admin.ModelAdmin[GroupText]):
    list_display = ["id", "group_id"]


class OrganizationAdmin(admin.ModelAdmin[Organization]):
    list_display = ["org_name", "name"]


class OrganizationTextAdmin(admin.ModelAdmin[OrganizationText]):
    list_display = ["id"]


admin.site.register(Group, GroupAdmin)
admin.site.register(GroupText, GroupTextAdmin)
admin.site.register(Organization, OrganizationAdmin)
admin.site.register(OrganizationText, OrganizationTextAdmin)
