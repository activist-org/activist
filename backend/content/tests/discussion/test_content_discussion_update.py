# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework import status

from content.factories import DiscussionFactory

pytestmark = pytest.mark.django_db


def test_content_discussion_update_ok_200(authenticated_client):
    client, user = authenticated_client
    user.is_confirmed = True
    user.verified = True
    user.save()

    thread = DiscussionFactory(created_by=user)

    response = client.put(
        path=f"/v1/content/discussions/{thread.id}",
        data={"title": thread.title},
    )

    assert response.status_code == status.HTTP_200_OK


def test_content_discussion_update_forbidden_403(authenticated_client):
    client, user = authenticated_client
    user.is_confirmed = True
    user.verified = True
    user.save()

    thread = DiscussionFactory()

    response = client.put(
        path=f"/v1/content/discussions/{thread.id}",
        data={"title": thread.title},
    )

    assert response.status_code == status.HTTP_403_FORBIDDEN
