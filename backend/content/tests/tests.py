# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Testing for the content app.
"""

# mypy: ignore-errors
import pytest

from content.factories import ResourceFactory, TaskFactory, TopicFactory
from unittest.mock import patch

pytestmark = pytest.mark.django_db


def test_str_methods() -> None:
    resource = ResourceFactory.build()
    task = TaskFactory.build()
    topics = TopicFactory.build()

    assert str(resource) == resource.name
    assert str(task) == task.name
    assert str(topics) == topics.name


@patch("content.signals.cache.keys")
@patch("content.signals.cache.delete_many")
def test_invalidate_resource_cache(mock_keys, mock_delete_many) -> None:
    resource = ResourceFactory.create()
    resource.save()

    mock_keys.assert_called()
    mock_delete_many.assert_called()
