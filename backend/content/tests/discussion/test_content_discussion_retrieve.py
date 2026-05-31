# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from django.test import Client
from rest_framework import status

from content.factories import DiscussionFactory

pytestmark = pytest.mark.django_db


def test_content_discussion_retrieve_ok_200(client: Client):
    thread = DiscussionFactory()

    response = client.get(path=f"/v1/content/discussions/{thread.id}")

    assert response.status_code == status.HTTP_200_OK
