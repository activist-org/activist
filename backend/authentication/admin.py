from django.contrib import admin

from .models import Support, SupportEntityType, User, UserResource, UserTask, UserTopic

admin.site.register(User)
admin.site.register(UserResource)
admin.site.register(UserTask)
admin.site.register(UserTopic)

admin.site.register(SupportEntityType)
admin.site.register(Support)
