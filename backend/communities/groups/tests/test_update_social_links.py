import uuid
from uuid import UUID

import pytest
from django.test import Client
from rest_framework.response import Response

from authentication.factories import UserFactory
from communities.groups.factories import GroupFactory

pytestmark = pytest.mark.django_db

"""
Function for posting to backend.
"""


def post_update(
    test_uuid: UUID,
    test_group: GroupFactory,
    test_order: str,
    test_link: str,
    test_label: str,
) -> Response:
    client = Client()
    response = client.put(
        path=f"/v1/communities/group_social_links/{test_uuid}/",
        data={
            "group": test_group,
            "order": test_order,
            "link": test_link,
            "label": test_label,
        },
    )

    return response


def test_update_social_links(client: Client) -> None:
    """
    Test cases:
    1. Group id does not exist.
    2. Group id exists and is updated as an authenticated user.
    """
    test_update_group = GroupFactory()
    test_order = "order"
    test_link = "link"
    test_label = "label"
    # 1. Bad UUID returns None
    bad_uuid = uuid.uuid4()
    response = post_update(
        test_uuid=bad_uuid,
        test_group=test_update_group,
        test_order=test_order,
        test_link=test_link,
        test_label=test_label,
    )
    assert response.status_code == 404

    # 2. Group ID exists and is updated as authenticated user.
    user = UserFactory()
    user.is_confirmed = True
    user.save()

    group_id = test_update_group.id
    login_response = client.post(
        path="/v1/auth/sign_in/", data={"email": user.email, "password": user.password}
    )

    if login_response.status_code == 200:
        response = post_update(
            test_uuid=group_id,
            test_group=test_update_group,
            test_order=test_order,
            test_link=test_link,
            test_label=test_label,
        )
        assert response.status_code == 200
