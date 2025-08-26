# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Configure Django admin for the communities app.
"""

from django.contrib import admin

from communities.groups.models import (
    Group,
    GroupFaq,
    GroupFlag,
    GroupImage,
    GroupMember,
    GroupText,
)
from communities.models import StatusType
from communities.organizations.models import (
    Organization,
    OrganizationApplication,
    OrganizationFaq,
    OrganizationFlag,
    OrganizationImage,
    OrganizationMember,
    OrganizationTask,
    OrganizationText,
)

# MARK: Register

admin.site.register(GroupImage)
admin.site.register(GroupMember)
admin.site.register(GroupFaq)
admin.site.register(OrganizationApplication)
admin.site.register(OrganizationImage)
admin.site.register(OrganizationMember)
admin.site.register(OrganizationTask)
admin.site.register(OrganizationFaq)
admin.site.register(StatusType)

# MARK: Group


class GroupAdmin(admin.ModelAdmin[Group]):
    """
    Admin interface for the Group model.

    Displays the group's internal name and display name in the admin list view.
    """

    list_display = ["group_name", "name"]


# MARK: Group Text


class GroupTextAdmin(admin.ModelAdmin[GroupText]):
    """
    Admin interface for the GroupText model.

    Displays the ID and associated Group in the admin list view.
    """

    list_display = ["id", "group"]


# MARK: Group Flag


class GroupFlagAdmin(admin.ModelAdmin[GroupFlag]):
    """
    Admin panel for the GroupFlag model.

    Displays the Groups which have been flagged and the users who flagged it.
    """

    list_display = ["group", "created_by", "created_on"]


# MARK: Org


class OrganizationAdmin(admin.ModelAdmin[Organization]):
    """
    Admin interface for the Organization model.

    Displays the organization's internal name and display name in the admin list view.
    """

    list_display = ["org_name", "name"]


# MARK: Org Text


class OrganizationTextAdmin(admin.ModelAdmin[OrganizationText]):
    """
    Admin interface for the OrganizationText model.

    Displays only the ID in the admin list view.
    """

    list_display = ["id"]


# MARK: Org Flag


class OrganizationFlagAdmin(admin.ModelAdmin[OrganizationFlag]):
    """
    Admin interface for OrganizationFlag model.

    Displays only the Organization and users who flagged it.
    """

    list_display = [
        "org",
        "created_by",
        "created_on",
    ]


# MARK: Register Admin

admin.site.register(Group, GroupAdmin)
admin.site.register(GroupText, GroupTextAdmin)
admin.site.register(GroupFlag, GroupFlagAdmin)
admin.site.register(Organization, OrganizationAdmin)
admin.site.register(OrganizationText, OrganizationTextAdmin)
admin.site.register(OrganizationFlag, OrganizationFlagAdmin)
