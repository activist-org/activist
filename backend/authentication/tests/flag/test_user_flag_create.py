# SPDX-License-Identifier: AGPL-3.0-or-later

import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory

pytestmark = pytest.mark.django_db

def test_user_flag_create(authenticated_client):
    # Partie non authentifiée
    client = APIClient()
    user = UserFactory(is_confirmed=True, verified=True)
    flagged_user = UserFactory(is_confirmed=True, verified=True)

    error_response = client.post(
        path="/v1/auth/user_flag",
        data={"user": flagged_user.id, "created_by": user.id},
    )
    assert error_response.status_code == 401
    error_response_body = error_response.json()
    assert error_response_body["detail"] == "You are not allowed flag this user."

    # Partie authentifiée : on utilise la fixture
    response = authenticated_client.post(
        path="/v1/auth/user_flag",
        data={"user": flagged_user.id, "created_by": authenticated_client.handler._force_user.id},
    )
    assert response.status_code == 201

