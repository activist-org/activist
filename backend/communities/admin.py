# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Configure Django admin for the communities app.
"""

from django.contrib import admin

from communities.groups.models import Group, GroupImage, GroupMember, GroupText
from communities.models import StatusType
from communities.organizations.models import (
    Organization,
    OrganizationApplication,
    OrganizationFlag,
    OrganizationImage,
    OrganizationMember,
    OrganizationTask,
    OrganizationText,
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
    """
    Admin interface for the Group model.

    Displays the group's internal name and display name in the admin list view.
    """

    list_display = ["group_name", "name"]


class GroupTextAdmin(admin.ModelAdmin[GroupText]):
    """
    Admin interface for the GroupText model.

    Displays the ID and associated Group in the admin list view.
    """

    list_display = ["id", "group"]


class OrganizationAdmin(admin.ModelAdmin[Organization]):
    """
    Admin interface for the Organization model.

    Displays the organization's internal name and display name in the admin list view.
    """

    list_display = ["org_name", "name"]


class OrganizationTextAdmin(admin.ModelAdmin[OrganizationText]):
    """
    Admin interface for the OrganizationText model.

    Displays only the ID in the admin list view.
    """

    list_display = ["id"]


class OrganizationFlagAdmin(admin.ModelAdmin[OrganizationFlag]):
    """
    Admin interface for OrganizationFlag model.

    Displays only the Organization ID, ID of user who flagged the Organization and the date of the report.
    """

    list_display = [
        "created_by",
        "created_at",
    ]  # removed flagged_org as list_display cannot include a many-to-many field.


admin.site.register(Group, GroupAdmin)
admin.site.register(GroupText, GroupTextAdmin)
admin.site.register(Organization, OrganizationAdmin)
admin.site.register(OrganizationText, OrganizationTextAdmin)
admin.site.register(OrganizationFlag, OrganizationFlagAdmin)
