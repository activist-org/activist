# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Testing for topic string methods.
"""

import pytest

from content.factories import TopicFactory

pytestmark = pytest.mark.django_db


def test_topic_str_methods() -> None:
    topics = TopicFactory.build()

    assert str(topics) == topics.type
