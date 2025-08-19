# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Configure Django admin for the content app.
"""

from django.contrib import admin

from content.models import (
    Discussion,
    DiscussionEntry,
    Faq,
    Image,
    Location,
    Resource,
    ResourceFlag,
    SocialLink,
    Tag,
    Task,
    Topic,
)

# MARK: Register

admin.site.register(Discussion)
admin.site.register(Faq)
admin.site.register(Image)
admin.site.register(Location)
admin.site.register(Resource)
admin.site.register(SocialLink)
admin.site.register(Tag)
admin.site.register(Task)
admin.site.register(Topic)
admin.site.register(DiscussionEntry)

# MARK: Resource Flag


class ResourceFlagAdmin(admin.ModelAdmin[ResourceFlag]):
    """
    Displays the flagged resources and the users who flagged it in the admin table.
    """

    list_display = ["resource", "created_by", "created_on"]


# MARK: Register Admin

admin.site.register(ResourceFlag, ResourceFlagAdmin)
