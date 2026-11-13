# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from django.test import Client
from rest_framework import status

from communities.organizations.factories import OrganizationFactory

pytestmark = pytest.mark.django_db


def test_org_event_list_ok_200(client: Client) -> None:
    org = OrganizationFactory()

    response = client.get(
        path=f"/v1/communities/organizations/{org.id}/events",
    )

    assert response.status_code == status.HTTP_200_OK


def test_org_event_list_invalid_id_404(client: Client) -> None:
    response = client.get(
        path="/v1/communities/organizations/not-a-uuid/events",
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND
