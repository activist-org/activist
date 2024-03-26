from django.contrib import admin
from django.contrib.auth.models import Group

from .models import (
    Support,
    SupportEntityType,
    UserModel,
    UserResource,
    UserTask,
    UserTopic,
)

# Remove default Group
admin.site.unregister(Group)

admin.site.register(UserModel)
admin.site.register(UserResource)
admin.site.register(UserTask)
admin.site.register(UserTopic)
admin.site.register(SupportEntityType)
admin.site.register(Support)
