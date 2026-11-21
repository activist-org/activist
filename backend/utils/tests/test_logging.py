# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Unit tests for the logging utilities.
"""

import logging

import pytest

from utils.logging import EntityLogger, get_logger

pytestmark = pytest.mark.django_db


# MARK: Helpers


class _FakeModel:
    """Minimal stand-in for a Django model instance used in tests."""

    def __init__(
        self,
        id: int | None = None,
        username: str | None = None,
        name: str | None = None,
        title: str | None = None,
    ) -> None:
        self.id = id
        self.username = username
        self.name = name
        self.title = title


# MARK: _format_entity


def test_entity_logger_format_entity_with_username_and_id() -> None:
    """
    Test _format_entity returns EntityType "name" (ID: id) for a model
    that has both a username and an id.
    """
    entity_logger = EntityLogger("test.format")
    entity = _FakeModel(id=1, username="alice")

    assert entity_logger._format_entity(entity) == '_FakeModel "alice" (ID: 1)'


def test_entity_logger_format_entity_with_name_and_id() -> None:
    """
    Test _format_entity returns EntityType "name" (ID: id) for a model
    that has a name attribute (not username) and an id.
    """
    entity_logger = EntityLogger("test.format")
    entity = _FakeModel(id=42, name="Community A")

    assert entity_logger._format_entity(entity) == '_FakeModel "Community A" (ID: 42)'


def test_entity_logger_format_entity_with_title_and_id() -> None:
    """
    Test _format_entity uses title when username and name are absent.
    """
    entity_logger = EntityLogger("test.format")
    entity = _FakeModel(id=7, title="Annual Rally")

    assert entity_logger._format_entity(entity) == '_FakeModel "Annual Rally" (ID: 7)'


def test_entity_logger_format_entity_with_id_only() -> None:
    """
    Test _format_entity returns EntityType (ID: id) when only id is set.
    """
    entity_logger = EntityLogger("test.format")
    entity = _FakeModel(id=99)

    assert entity_logger._format_entity(entity) == "_FakeModel (ID: 99)"


def test_entity_logger_format_entity_with_name_only() -> None:
    """
    Test _format_entity returns EntityType "name" when id is absent.
    """
    entity_logger = EntityLogger("test.format")
    entity = _FakeModel(name="Nameless")

    assert entity_logger._format_entity(entity) == '_FakeModel "Nameless"'


def test_entity_logger_format_entity_with_no_identifying_fields() -> None:
    """
    Test _format_entity falls back to the class name when no id or name exists.
    """
    entity_logger = EntityLogger("test.format")
    entity = _FakeModel()

    assert entity_logger._format_entity(entity) == "_FakeModel"


def test_entity_logger_format_entity_with_string() -> None:
    """
    Test _format_entity returns the string unchanged when passed a str.
    """
    entity_logger = EntityLogger("test.format")

    assert entity_logger._format_entity("plain_string") == "plain_string"


# MARK: log_attempt


def test_entity_logger_log_attempt(caplog: pytest.LogCaptureFixture) -> None:
    """
    Test log_attempt emits an INFO message in the form
    "{entity} {action} attempt".
    """
    entity_logger = EntityLogger("test.attempt")
    entity = _FakeModel(id=1, username="alice")

    with caplog.at_level(logging.INFO, logger="test.attempt"):
        entity_logger.log_attempt(entity, "login")

    assert '_FakeModel "alice" (ID: 1) login attempt' in caplog.text


def test_entity_logger_log_attempt_with_actor(caplog: pytest.LogCaptureFixture) -> None:
    """
    Test log_attempt appends "by {actor}" when an actor is provided.
    """
    entity_logger = EntityLogger("test.attempt_actor")
    entity = _FakeModel(id=10, name="Some Resource")
    actor = _FakeModel(id=1, username="admin")

    with caplog.at_level(logging.INFO, logger="test.attempt_actor"):
        entity_logger.log_attempt(entity, "deletion", actor=actor)

    assert (
        '_FakeModel "Some Resource" (ID: 10) deletion attempt by _FakeModel "admin" (ID: 1)'
        in caplog.text
    )


# MARK: log_success


def test_entity_logger_log_success(caplog: pytest.LogCaptureFixture) -> None:
    """
    Test log_success emits an INFO message in the form
    "{entity} {action} successfully".
    """
    entity_logger = EntityLogger("test.success")
    entity = _FakeModel(id=5, username="bob")

    with caplog.at_level(logging.INFO, logger="test.success"):
        entity_logger.log_success(entity, "created")

    assert '_FakeModel "bob" (ID: 5) created successfully' in caplog.text


def test_entity_logger_log_success_with_actor(caplog: pytest.LogCaptureFixture) -> None:
    """
    Test log_success appends "by {actor}" when an actor is provided.
    """
    entity_logger = EntityLogger("test.success_actor")
    entity = _FakeModel(id=20, name="Event Name")
    actor = _FakeModel(id=2, username="staff")

    with caplog.at_level(logging.INFO, logger="test.success_actor"):
        entity_logger.log_success(entity, "updated", actor=actor)

    assert (
        '_FakeModel "Event Name" (ID: 20) updated successfully by _FakeModel "staff" (ID: 2)'
        in caplog.text
    )


# MARK: log_failure


def test_entity_logger_log_failure(caplog: pytest.LogCaptureFixture) -> None:
    """
    Test log_failure emits a WARNING message in the form
    "{entity} {action} failed: {reason}".
    """
    entity_logger = EntityLogger("test.failure")
    entity = _FakeModel(id=3, username="carol")

    with caplog.at_level(logging.WARNING, logger="test.failure"):
        entity_logger.log_failure(entity, "sign-in", "invalid password")

    assert '_FakeModel "carol" (ID: 3) sign-in failed: invalid password' in caplog.text


def test_entity_logger_log_failure_with_actor(caplog: pytest.LogCaptureFixture) -> None:
    """
    Test log_failure appends "by {actor}" before the reason when an actor
    is provided.
    """
    entity_logger = EntityLogger("test.failure_actor")
    entity = _FakeModel(id=30, name="Flag")
    actor = _FakeModel(id=4, username="dave")

    with caplog.at_level(logging.WARNING, logger="test.failure_actor"):
        entity_logger.log_failure(entity, "deletion", "not authorized", actor=actor)

    assert (
        '_FakeModel "Flag" (ID: 30) deletion failed by _FakeModel "dave" (ID: 4): not authorized'
        in caplog.text
    )


# MARK: log_error


def test_entity_logger_log_error(caplog: pytest.LogCaptureFixture) -> None:
    """
    Test log_error emits an ERROR message in the form
    "{entity} {action} error: {reason}".
    """
    entity_logger = EntityLogger("test.error")
    entity = _FakeModel(id=7, name="Resource")

    with caplog.at_level(logging.ERROR, logger="test.error"):
        entity_logger.log_error(entity, "creation", "database error")

    assert '_FakeModel "Resource" (ID: 7) creation error: database error' in caplog.text


def test_entity_logger_log_error_with_actor(caplog: pytest.LogCaptureFixture) -> None:
    """
    Test log_error appends "by {actor}" before the reason when an actor
    is provided.
    """
    entity_logger = EntityLogger("test.error_actor")
    entity = _FakeModel(id=70, name="Config")
    actor = _FakeModel(id=5, username="eve")

    with caplog.at_level(logging.ERROR, logger="test.error_actor"):
        entity_logger.log_error(entity, "update", "unexpected exception", actor=actor)

    assert (
        '_FakeModel "Config" (ID: 70) update error by _FakeModel "eve" (ID: 5): unexpected exception'
        in caplog.text
    )


# MARK: debug


def test_entity_logger_debug(caplog: pytest.LogCaptureFixture) -> None:
    """
    Test debug emits a DEBUG message in the form
    "{entity}: {message}".
    """
    entity_logger = EntityLogger("test.debug")
    entity = _FakeModel(id=8, username="frank")

    with caplog.at_level(logging.DEBUG, logger="test.debug"):
        entity_logger.debug(entity, "processing started")

    assert '_FakeModel "frank" (ID: 8): processing started' in caplog.text


# MARK: get_logger


def test_entity_logger_get_logger_returns_entity_logger() -> None:
    """
    Test get_logger returns an EntityLogger instance.
    """
    result = get_logger("test.factory")

    assert isinstance(result, EntityLogger)
