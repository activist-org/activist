from django.contrib import admin

from .models import (
    Discussion,
    DiscussionEntry,
    DiscussionTag,
    Faq,
    Image,
    Location,
    Resource,
    ResourceTag,
    ResourceTopic,
    Role,
    SocialLink,
    Tag,
    Task,
    TaskTag,
    Topic,
    TopicFormat,
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
admin.site.register(DiscussionTag)
admin.site.register(ResourceTag)
admin.site.register(ResourceTopic)
admin.site.register(TaskTag)
admin.site.register(TopicFormat)
