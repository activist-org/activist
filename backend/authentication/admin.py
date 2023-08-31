from django.contrib import admin

from .models import *


class UserAdmin(admin.ModelAdmin):
    list_display = ("username", "first_name", "last_name", "email", "creation_date")


admin.site.register(User, UserAdmin)
