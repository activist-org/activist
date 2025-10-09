# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Testing for the communities app.
"""

# mypy: ignore-errors
import pytest

from authentication.factories import UserFactory
from communities.models import Status, StatusType
from communities.organizations.factories import (
    OrganizationFactory,
)

pytestmark = pytest.mark.django_db


def test_status_str_methods() -> None:
    """
    Test the __str__ methods of the Status and StatusType models.

    Notes
    -----
    There are status types preloaded into the test database by the fixture "fixtures/status_types.json".
    """

    status_type = StatusType.objects.create(name="New Status")

    # Create an organization to use with Status.
    organization = OrganizationFactory.create()

    # Create a user for the Status.
    user = UserFactory.create()

    status = Status.objects.create(status_type=status_type, org=organization, user=user)

    assert str(status_type) == "New Status"
    assert str(status) == f"{organization.name} - New Status"
