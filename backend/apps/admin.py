from django.contrib import admin

from .models import *


# Register your models here.
class UserAdmin(admin.ModelAdmin):
    list_display = ("username", "first_name", "last_name", "email", "date_joined")


class OrganizationAdmin(admin.ModelAdmin):
    list_display = ("name", "tagline", "application_id", "social_accounts", "total_flags","created_by","creation_date")


admin.site.register(User, UserAdmin)
admin.site.register(Organization, OrganizationAdmin)
