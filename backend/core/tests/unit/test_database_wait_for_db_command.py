# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Tests for the wait_for_db management command.
"""

from unittest.mock import patch

import pytest
from django.core.management import call_command
from django.db import OperationalError

pytestmark = pytest.mark.django_db


class TestWaitForDBManagementCommand:
    """
    Test cases for the wait_for_db management command.
    """

    @patch("django.db.backends.base.base.BaseDatabaseWrapper.ensure_connection")
    def test_database_wait_for_db_command_ready(self, mock_ensure_connection):
        """
        Test waiting for db when db is already available.
        """
        # Mock ensure_connection to not raise any exception.
        mock_ensure_connection.return_value = None

        call_command("wait_for_db")
        mock_ensure_connection.assert_called_once()

    @patch("time.sleep")
    @patch("django.db.backends.base.base.BaseDatabaseWrapper.ensure_connection")
    def test_database_wait_for_db_command_retries(
        self, mock_ensure_connection, mock_sleep
    ):
        """
        Test waiting for db when db is not immediately available.
        """
        # Configure the mock to raise OperationalError twice, then succeed.
        mock_ensure_connection.side_effect = [
            OperationalError(),  # first call fails
            OperationalError(),  # second call fails
            None,  # third call succeeds
        ]

        call_command("wait_for_db", poll_seconds=1, max_retries=3)

        assert mock_ensure_connection.call_count == 3
        # Assert sleep was called twice (between retries).
        assert mock_sleep.call_count == 2

    @patch("sys.exit")
    @patch("django.db.backends.base.base.BaseDatabaseWrapper.ensure_connection")
    def test_database_wait_for_db_command_timeout(
        self, mock_ensure_connection, mock_exit
    ):
        """
        Test that command exits with error when db is not available after max retries.
        """
        # Configure the mock to always raise OperationalError.
        mock_ensure_connection.side_effect = OperationalError(
            "Could not connect to database"
        )

        call_command("wait_for_db", poll_seconds=0.1, max_retries=2)

        assert mock_ensure_connection.call_count == 2
        # Assert sys.exit(1) was called.
        mock_exit.assert_called_once_with(1)
