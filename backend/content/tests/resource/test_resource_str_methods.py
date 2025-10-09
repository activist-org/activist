# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Testing for resource string methods.
"""

import pytest

from content.factories import ResourceFactory

pytestmark = pytest.mark.django_db


def test_str_methods() -> None:
    resource = ResourceFactory.build()

    assert str(resource) == resource.name
