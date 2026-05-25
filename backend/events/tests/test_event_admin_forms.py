# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Testing for proper event admin form cleaning.
"""

import pytest
from django.core.exceptions import ValidationError

from content.factories import EventLocationFactory
from events.admin import EventAdminForm
from events.models import Event

pytestmark = pytest.mark.django_db


class TestEventAdminForm(EventAdminForm):
    class Meta:
        model = Event
        fields = ["location_type", "physical_location", "online_location_link"]


# Ensure that when .clean() is called, an error is thrown
# if there is invalid data. Do nothing otherwise.


def test_event_admin_forms_good_physical_event() -> None:
    test_address = EventLocationFactory.create()

    form = TestEventAdminForm(EventAdminForm)
    form.cleaned_data = {
        "location_type": "physical",
        "physical_location": test_address,
        "online_location_link": "",
    }

    assert form.clean()


def test_event_admin_forms_bad_physical_event() -> None:
    test_url = "https://example.com"

    form = TestEventAdminForm(EventAdminForm)
    form.cleaned_data = {
        "location_type": "physical",
        "physical_location": "",
        "online_location_link": test_url,
    }

    with pytest.raises(ValidationError):
        form.clean()


def test_event_admin_forms_good_online_event() -> None:
    test_url = "https://example.com"

    form = TestEventAdminForm(EventAdminForm)
    form.cleaned_data = {
        "location_type": "online",
        "physical_location": "",
        "online_location_link": test_url,
    }

    assert form.clean()


def test_event_admin_forms_bad_online_event() -> None:
    test_address = EventLocationFactory.create()

    form = TestEventAdminForm(EventAdminForm)
    form.cleaned_data = {
        "location_type": "online",
        "physical_location": test_address,
        "online_location_link": "",
    }

    with pytest.raises(ValidationError):
        form.clean()
