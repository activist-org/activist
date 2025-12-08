# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest

from content.factories import DiscussionEntryFactory, DiscussionFactory

pytestmark = pytest.mark.django_db


def test_disc_entry_update(authenticated_client):
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

    assert response.status_code == 200

    # Authorized non-owner updates the entry.
    unowned_instance = DiscussionEntryFactory()
    response = client.put(
        path=f"/v1/content/discussion_entries/{unowned_instance.id}",
        data={"discussion": discussion_thread.id},
    )
    assert response.status_code == 403
    assert (
        response.json()["detail"]
        == "You are not allowed to update this discussion entry."
    )


def test_disc_entry_update_not_authorized(authenticated_client):
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

    assert response.status_code == 403
