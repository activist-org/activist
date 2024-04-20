from django.contrib import admin

from .models import (
    Faq,
    Image,
    IsoCodeMap,
    Resource,
    ResourceTopic,
    Task,
    Topic,
    TopicFormat,
)

admin.site.register(Faq)
admin.site.register(Image)
admin.site.register(Resource)
admin.site.register(ResourceTopic)
admin.site.register(Task)
admin.site.register(Topic)
admin.site.register(TopicFormat)
admin.site.register(IsoCodeMap)
