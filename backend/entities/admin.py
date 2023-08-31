from django.contrib import admin

from .models import *


class OrganizationAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "tagline",
        "application_id",
        "social_accounts",
        "total_flags",
        "created_by",
        "creation_date",
    )


admin.site.register(Organization, OrganizationAdmin)
