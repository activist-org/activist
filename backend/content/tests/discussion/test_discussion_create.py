# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from content.factories import DiscussionFactory

pytestmark = pytest.mark.django_db


def test_discussion_create(authenticated_client):
    client, user = authenticated_client
    user.is_confirmed = True
    user.verified = True
    user.save()

    discussion_thread = DiscussionFactory(
        title="Unique Title", category="Unique Category"
    )

    response = client.post(
        path="/v1/content/discussions",
        data={"title": discussion_thread.title, "category": discussion_thread.category},
    )

    assert response.status_code == 201


def test_discussion_create_not_authorized():
    """Test that unauthenticated users cannot create discussions"""
    client = APIClient()

    discussion_thread = DiscussionFactory(
        title="Unique Title", category="Unique Category"
    )

    response = client.post(
        path="/v1/content/discussions",
        data={"title": discussion_thread.title, "category": discussion_thread.category},
    )

    # IsAuthenticatedOrReadOnly returns 401 for unauthenticated write requests
    assert response.status_code == 401
