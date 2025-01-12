# SPDX-License-Identifier: AGPL-3.0-or-later
from django.contrib import admin

from .models import (
    Group,
    GroupImage,
    GroupMember,
    GroupText,
    Organization,
    OrganizationApplication,
    OrganizationImage,
    OrganizationMember,
    OrganizationTask,
    OrganizationText,
    StatusType,
)

# MARK: Bridge Tables


admin.site.register(GroupImage)
admin.site.register(GroupMember)
admin.site.register(OrganizationApplication)
admin.site.register(OrganizationImage)
admin.site.register(OrganizationMember)
admin.site.register(OrganizationTask)
admin.site.register(StatusType)

# MARK: Methods


class GroupAdmin(admin.ModelAdmin[Group]):
    list_display = ["group_name", "name"]


class GroupTextAdmin(admin.ModelAdmin[GroupText]):
    list_display = ["id", "group"]


class OrganizationAdmin(admin.ModelAdmin[Organization]):
    list_display = ["org_name", "name"]


class OrganizationTextAdmin(admin.ModelAdmin[OrganizationText]):
    list_display = ["id"]


admin.site.register(Group, GroupAdmin)
admin.site.register(GroupText, GroupTextAdmin)
admin.site.register(Organization, OrganizationAdmin)
admin.site.register(OrganizationText, OrganizationTextAdmin)
