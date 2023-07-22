from django.contrib import admin

from .models import *


# Register your models here.
class UserAdmin(admin.ModelAdmin):
    list_display = ("username", "first_name", "last_name", "email", "date_joined")


class OrganizationAdmin(admin.ModelAdmin):
    list_display = ("name", "tagline")


admin.site.register(User, UserAdmin)
admin.site.register(Organization, OrganizationAdmin)
