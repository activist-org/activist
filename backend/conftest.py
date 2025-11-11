# SPDX-License-Identifier: AGPL-3.0-or-later
from typing import cast

import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from authentication.models import UserModel


@pytest.fixture
def authenticated_client() -> tuple[APIClient, UserModel]:
    """
    Returns an authenticated APIClient with a test user.

    The client is authenticated using DRF's force_authenticate method,
    bypassing the need for actual login requests and token management.

    Returns
    -------
    tuple[APIClient, UserModel]
        A tuple containing the authenticated client and the UserModel.
    """
    client = APIClient()
    test_username = "test_user_authenticated"
    test_pass = "Activist@123!?"

    # Create a confirmed user with a strong password
    user: UserModel = cast(
        UserModel, UserFactory(username=test_username, plaintext_password=test_pass)
    )  # type: ignore[no-untyped-call]

    # Authenticate the client using DRF's force_authenticate
    client.force_authenticate(user=user)

    return client, user
