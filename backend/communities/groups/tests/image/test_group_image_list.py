# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from django.test import Client
from rest_framework import status

from communities.groups.factories import GroupFactory

pytestmark = pytest.mark.django_db


def test_group_image_list_ok_200(client: Client) -> None:
    group = GroupFactory()

    response = client.get(
        path=f"/v1/communities/group/{group.id}/images",
    )

    assert response.status_code == status.HTTP_200_OK


def test_group_image_list_invalid_id_404(client: Client) -> None:
    response = client.get(
        path="/v1/communities/group/not-a-uuid/images",
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND
