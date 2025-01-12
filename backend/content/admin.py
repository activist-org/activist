# SPDX-License-Identifier: AGPL-3.0-or-later
from django.contrib import admin

from .models import (
    Discussion,
    DiscussionEntry,
    Faq,
    Image,
    Location,
    Resource,
    Role,
    SocialLink,
    Tag,
    Task,
    Topic,
)

# MARK: Main Tables

admin.site.register(Discussion)
admin.site.register(Faq)
admin.site.register(Image)
admin.site.register(Location)
admin.site.register(Resource)
admin.site.register(Role)
admin.site.register(SocialLink)
admin.site.register(Tag)
admin.site.register(Task)
admin.site.register(Topic)

# MARK: Bridge Tables

admin.site.register(DiscussionEntry)
