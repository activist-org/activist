# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Testing for the authentication app.
"""

import logging

import pytest

from authentication.factories import (
    SupportEntityTypeFactory,
    SupportFactory,
    UserFactory,
)

logger = logging.getLogger(__name__)

pytestmark = pytest.mark.django_db


# MARK: Str Methods


def test_str_methods() -> None:
    """
    Test the __str__ methods of models in the authentication app.

    Checks that the string representation of:
    - SupportEntityType returns its 'name' field
    - Support returns its string representation of the 'id' field
    - User returns its 'username' field
    """
    support_entity_type = SupportEntityTypeFactory.build()
    support = SupportFactory.build()
    user = UserFactory.build()

    assert str(support_entity_type) == support_entity_type.name
    assert str(support) == str(support.id)
    assert str(user) == user.username
