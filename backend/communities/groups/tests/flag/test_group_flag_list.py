# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest

pytestmark = pytest.mark.django_db


def test_group_flag_list(authenticated_client):
    """
    Test to list all group flags.
    """
    client, user = authenticated_client
    response = client.get(path="/v1/communities/group_flags")

    assert response.status_code == 200
