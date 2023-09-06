from django.contrib import admin

from .models import Organization


class OrganizationAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "tagline",
        "social_accounts",
        "total_flags",
        "created_by",
        "creation_date",
        "deletion_date",
    )


admin.site.register(Organization, OrganizationAdmin)