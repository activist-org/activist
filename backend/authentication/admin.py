from django.contrib import admin
from django.contrib.auth.models import Group

from .models import Support, SupportEntityType, User, UserResource, UserTask, UserTopic

# Remove default Group
admin.site.unregister(Group)

admin.site.register(User)
admin.site.register(UserResource)
admin.site.register(UserTask)
admin.site.register(UserTopic)
admin.site.register(SupportEntityType)
admin.site.register(Support)
