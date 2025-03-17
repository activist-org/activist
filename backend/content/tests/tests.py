# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Testing for the content app.
"""

# mypy: ignore-errors
import pytest

from content.factories import ResourceFactory, TaskFactory, TopicFactory

pytestmark = pytest.mark.django_db


def test_str_methods() -> None:
    resource = ResourceFactory.build()
    task = TaskFactory.build()
    topics = TopicFactory.build()

    assert str(resource) == resource.name
    assert str(task) == task.name
    assert str(topics) == topics.name
