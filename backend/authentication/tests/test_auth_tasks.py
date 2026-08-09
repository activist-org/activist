# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from django_tasks import TaskResultStatus

from authentication.tasks import email_user

pytestmark = pytest.mark.django_db


def test_auth_tasks_email_user() -> None:
    """
    Test that the email_user task is enqueued correctly.

    Uses DummyBackend (environment: "development", see settings.py TASK_BACKEND), which never executes enqueued tasks — results stay
    frozen at READY forever. This test only verifies that email_user can be
    called with valid parameters and is enqueued with the expected status and
    arguments.

    It intentionally does not verify that the task body actually
    sends an email; that would require ImmediateBackend or an integration
    test against a real email backend.
    """
    from_email = "no-reply@example.com"
    to_email = "user@example.com"
    subject = "Test Email"
    message = "<p>This is a test email.</p>"

    result = email_user.enqueue(from_email, to_email, subject, message)

    assert result.status == TaskResultStatus.READY
    assert result.args == [from_email, to_email, subject, message]
