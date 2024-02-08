from django.contrib import admin

from .models import Faq, Resource, ResourceTopic, Task, Topic, TopicFormat

admin.site.register(Resource)
admin.site.register(ResourceTopic)
admin.site.register(Task)
admin.site.register(Topic)
admin.site.register(TopicFormat)
admin.site.register(Faq)
