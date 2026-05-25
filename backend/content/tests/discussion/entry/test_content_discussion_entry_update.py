# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework import status

from content.factories import DiscussionEntryFactory, DiscussionFactory

pytestmark = pytest.mark.django_db


def test_content_discussion_entry_update(authenticated_client):
    """
    Test for updating a discussion entry.
    """
    client, user = authenticated_client

    discussion_thread = DiscussionFactory(created_by=user)
    entry_instance = DiscussionEntryFactory(created_by=user)

    response = client.put(
        path=f"/v1/content/discussion_entries/{entry_instance.id}",
        data={"discussion": discussion_thread.id},
    )

    assert response.status_code == status.HTTP_200_OK

    # Authorized non-owner updates the entry.
    unowned_instance = DiscussionEntryFactory()
    response = client.put(
        path=f"/v1/content/discussion_entries/{unowned_instance.id}",
        data={"discussion": discussion_thread.id},
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert (
        response.json()["detail"]
        == "You are not allowed to update this discussion entry."
    )


def test_content_discussion_entry_update_forbidden_403(authenticated_client):
    """
    Test for updating a discussion entry.
    """
    client, user = authenticated_client

    discussion_thread = DiscussionFactory()
    entry_instance = DiscussionEntryFactory()

    response = client.put(
        path=f"/v1/content/discussion_entries/{entry_instance.id}",
        data={"discussion": discussion_thread.id},
    )

    assert response.status_code == status.HTTP_403_FORBIDDEN
