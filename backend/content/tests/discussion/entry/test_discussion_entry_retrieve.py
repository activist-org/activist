# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from content.factories import DiscussionEntryFactory

pytestmark = pytest.mark.django_db


def test_disc_entry_retrieve():
    """
    Test to retrieve the discussion entry based on the id.
    """
    client = APIClient()

    entry_instance = DiscussionEntryFactory()

    response = client.get(path=f"/v1/content/discussion_entries/{entry_instance.id}")

    assert response.status_code == 200
