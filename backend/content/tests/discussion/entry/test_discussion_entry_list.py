# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

pytestmark = pytest.mark.django_db


def test_disc_entry_list():
    """
    Test to retrieve the list of discussion entries.
    """
    client = APIClient()

    response = client.get(path="/v1/content/discussion_entries")

    assert response.status_code == 200
