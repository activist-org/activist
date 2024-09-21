from django.contrib import admin

from .models import (
    Faq,
    Image,
    Resource,
    ResourceTopic,
    Task,
    Topic,
    TopicFormat,
)

# MARK: Main Tables

admin.site.register(Faq)
admin.site.register(Image)
admin.site.register(Resource)
admin.site.register(Task)
admin.site.register(Topic)

# MARK: Main Tables

admin.site.register(ResourceTopic)
admin.site.register(TopicFormat)
