# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest

from content.factories import DiscussionFactory

pytestmark = pytest.mark.django_db


def test_discussion_update(authenticated_client):
    client, user = authenticated_client
    user.is_confirmed = True
    user.verified = True
    user.save()

    thread = DiscussionFactory(created_by=user)

    response = client.put(
        path=f"/v1/content/discussions/{thread.id}",
        data={"title": thread.title},
    )

    assert response.status_code == 200


def test_discussion_update_not_authorized(authenticated_client):
    client, user = authenticated_client
    user.is_confirmed = True
    user.verified = True
    user.save()

    thread = DiscussionFactory()

    response = client.put(
        path=f"/v1/content/discussions/{thread.id}",
        data={"title": thread.title},
    )

    assert response.status_code == 403
