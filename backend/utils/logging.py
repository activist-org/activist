# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Standardized logging utilities for the backend.
"""

import logging
from typing import Any


class EntityLogger:
    """
    Standardized logging for backend entities.

    Wraps Python's standard logger to produce consistent messages based on
    entity instances, ensuring uniform log output across the backend.

    Parameters
    ----------
    name : str
        The logger name, typically ``__name__`` of the calling module.

    Examples
    --------
    >>> logger = get_logger(__name__)
    >>> logger.log_success(user, "created")
    # → INFO  UserModel "alice" (ID: 1) created successfully
    >>> logger.log_failure(user, "sign-in", "invalid password")
    # → WARNING  UserModel "alice" (ID: 1) sign-in failed: invalid password
    """

    def __init__(self, name: str) -> None:
        self._logger = logging.getLogger(name)

    def _format_entity(self, entity: Any) -> str:
        """
        Return a consistent string representation of an entity.

        Parameters
        ----------
        entity : Any
            A model instance or plain string to format.

        Returns
        -------
        str
            Formatted string in one of the following forms:

            - ``EntityType "name" (ID: id)`` – when both name and ID are present
            - ``EntityType "name"``           – name only
            - ``EntityType (ID: id)``         – ID only
            - ``EntityType``                  – neither available
            - The original string             – when entity is already a str
        """
        if isinstance(entity, str):
            return entity

        entity_type = type(entity).__name__
        entity_id = getattr(entity, "id", None) or getattr(entity, "pk", None)
        entity_name = (
            getattr(entity, "username", None)
            or getattr(entity, "name", None)
            or getattr(entity, "title", None)
        )

        if entity_name and entity_id:
            return f'{entity_type} "{entity_name}" (ID: {entity_id})'
        if entity_name:
            return f'{entity_type} "{entity_name}"'
        if entity_id:
            return f"{entity_type} (ID: {entity_id})"
        return entity_type

    def log_attempt(self, entity: Any, action: str, actor: Any = None) -> None:
        """
        Log an attempted operation on an entity at INFO level.

        Parameters
        ----------
        entity : Any
            The entity the operation is being performed on.
        action : str
            The action being attempted (e.g., ``"login"``, ``"deletion"``).
        actor : Any, optional
            The entity performing the action.
        """
        msg = f"{self._format_entity(entity)} {action} attempt"
        if actor is not None:
            msg += f" by {self._format_entity(actor)}"
        self._logger.info(msg)

    def log_success(self, entity: Any, action: str, actor: Any = None) -> None:
        """
        Log a successful operation on an entity at INFO level.

        Parameters
        ----------
        entity : Any
            The entity the operation was performed on.
        action : str
            The action that succeeded (e.g., ``"created"``, ``"deleted"``).
        actor : Any, optional
            The entity that performed the action.
        """
        msg = f"{self._format_entity(entity)} {action} successfully"
        if actor is not None:
            msg += f" by {self._format_entity(actor)}"
        self._logger.info(msg)

    def log_failure(
        self, entity: Any, action: str, reason: str, actor: Any = None
    ) -> None:
        """
        Log a failed operation on an entity at WARNING level.

        Parameters
        ----------
        entity : Any
            The entity the operation was attempted on.
        action : str
            The action that failed (e.g., ``"sign-in"``, ``"email verification"``).
        reason : str
            A short explanation of why the operation failed.
        actor : Any, optional
            The entity that attempted the action.
        """
        msg = f"{self._format_entity(entity)} {action} failed"
        if actor is not None:
            msg += f" by {self._format_entity(actor)}"
        msg += f": {reason}"
        self._logger.warning(msg)

    def log_error(
        self, entity: Any, action: str, reason: str, actor: Any = None
    ) -> None:
        """
        Log an unexpected error during an operation on an entity at ERROR level.

        Parameters
        ----------
        entity : Any
            The entity involved in the failed operation.
        action : str
            The action that caused the error (e.g., ``"creation"``, ``"update"``).
        reason : str
            A short explanation of the error.
        actor : Any, optional
            The entity that triggered the operation.
        """
        msg = f"{self._format_entity(entity)} {action} error"
        if actor is not None:
            msg += f" by {self._format_entity(actor)}"
        msg += f": {reason}"
        self._logger.error(msg)

    def debug(self, entity: Any, message: str) -> None:
        """
        Log a debug-level message for an entity.

        Parameters
        ----------
        entity : Any
            The entity the message relates to.
        message : str
            The debug message.
        """
        self._logger.debug(f"{self._format_entity(entity)}: {message}")


def get_logger(name: str) -> EntityLogger:
    """
    Return an EntityLogger for the given module name.

    Usage mirrors Python's ``logging.getLogger(__name__)``.

    Parameters
    ----------
    name : str
        Typically ``__name__`` of the calling module.

    Returns
    -------
    EntityLogger
        A logger that produces standardized entity-based messages.
    """
    return EntityLogger(name)
