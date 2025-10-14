# SPDX-License-Identifier: AGPL-3.0-or-later
import logging

import pytest

from authentication.models import UserModel

logger = logging.getLogger(__name__)

pytestmark = pytest.mark.django_db


# MARK: Create User and SuperUser


def test_create_user_and_superuser():
    """
    Test create_user and create_superuser methods of the CustomAccountManager.
    """
    logger.info("Starting user and superuser creation tests")
    manager = UserModel.objects

    # Test creating a user with email.
    logger.info("Testing user creation with email")
    user = manager.create_user(
        username="testuser1",
        password="StrongPassword123$",
        email="test1@example.com",
    )
    assert user.username == "testuser1"
    assert user.email == "test1@example.com"
    assert user.check_password("StrongPassword123$")
    assert not user.is_staff
    assert not user.is_superuser
    assert user.is_active
    logger.info(f"Successfully created user: {user.username} with email: {user.email}")

    # Test creating a user without email.
    user_no_email = manager.create_user(
        username="testuser2",
        password="StrongPassword123$",
    )
    assert user_no_email.username == "testuser2"
    assert user_no_email.email == ""

    # Test creating a superuser with all required flags.
    logger.info("Testing superuser creation")
    superuser = manager.create_superuser(
        email="admin@example.com",
        username="admin",
        password="AdminPassword123$",
    )
    assert superuser.username == "admin"
    assert superuser.email == "admin@example.com"
    assert superuser.is_staff
    assert superuser.is_superuser
    assert superuser.is_active
    logger.info(f"Successfully created superuser: {superuser.username}")

    # Test that creating a superuser with is_staff=False raises the expected error.
    with pytest.raises(
        ValueError, match="Superuser must be assigned to is_staff=True."
    ):
        manager.create_superuser(
            email="admin2@example.com",
            username="admin2",
            password="AdminPassword123$",
            is_staff=False,
        )

    # Test that creating a superuser with is_superuser=False raises the expected error.
    with pytest.raises(
        ValueError, match="Superuser must be assigned to is_superuser=True."
    ):
        manager.create_superuser(
            email="admin3@example.com",
            username="admin3",
            password="AdminPassword123$",
            is_superuser=False,
        )
