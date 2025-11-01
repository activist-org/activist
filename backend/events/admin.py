# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Configure Django admin for the events app.
"""

from typing import Any

from django.contrib import admin
from django.core.exceptions import ValidationError
from django.forms import ModelForm

from events.models import (
    Event,
    EventAttendee,
    EventAttendeeStatus,
    EventFaq,
    EventFlag,
    EventText,
    Format,
    Role,
)

# MARK: Event Admin


class EventAdminForm(ModelForm):  # type: ignore[type-arg]
    """Custom form for Event admin to handle conditional validation."""

    def clean(self) -> dict[str, Any]:
        """
        Validate and normalize Event admin form data based on the `setting` field.

        Returns
        -------
        dict
            Validated and normalized form data.
        """
        cleaned_data: dict[str, Any] = super().clean() or {}
        setting = cleaned_data.get("setting")
        online_location_link = cleaned_data.get("online_location_link")
        offline_location = cleaned_data.get("offline_location")

        if setting == "online":
            if not online_location_link:
                raise ValidationError(
                    {
                        "online_location_link": "Online location link is required for online events."
                    }
                )
            if offline_location:
                cleaned_data["offline_location"] = None

        elif setting == "offline":
            if not offline_location:
                raise ValidationError(
                    {
                        "offline_location": "Offline location is required for offline events."
                    }
                )
            if online_location_link:
                cleaned_data["online_location_link"] = None

        return cleaned_data


class EventAdmin(admin.ModelAdmin):  # type: ignore[type-arg]
    """Admin interface for Event model."""

    class Meta:
        model = Event

    form = EventAdminForm


admin.site.register(Event, EventAdmin)
admin.site.register(Format)
admin.site.register(Role)
admin.site.register(EventFaq)
admin.site.register(EventAttendee)
admin.site.register(EventAttendeeStatus)
admin.site.register(EventText)

# MARK: Event Flag


class EventFlagAdmin(admin.ModelAdmin):  # type: ignore[type-arg]
    """
    Admin interface for EventFlag model.

    Displays the Event, User and the date of the report filed.
    """

    class Meta:
        model = EventFlag

    list_display = ["event", "created_by", "creation_date"]


# MARK: Register Admin

admin.site.register(EventFlag, EventFlagAdmin)
