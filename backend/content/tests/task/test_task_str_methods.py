# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Testing for task string methods.
"""

import pytest

from content.factories import TaskFactory

pytestmark = pytest.mark.django_db


def test_str_methods() -> None:
    task = TaskFactory.build()

    assert str(task) == task.name
