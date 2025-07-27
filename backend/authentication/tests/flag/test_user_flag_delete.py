# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest

from authentication.factories import UserFlagFactory

pytestmark = pytest.mark.django_db


def test_user_flag_delete(authenticated_client):
    """
    Test to delete a flag of a user.
    """
    flagged_user = UserFlagFactory()

    response = authenticated_client.delete(
        path=f"/v1/auth/user_flag/{flagged_user.id}"
    )
    assert response.status_code == 204
