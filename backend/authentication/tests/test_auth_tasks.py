# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from django_tasks import TaskResultStatus, default_task_backend

from authentication.tasks import email_user

pytestmark = pytest.mark.django_db


def test_auth_tasks_email_user() -> None:
    """
    Test the email_user task to ensure it sends an email successfully.

    This test checks that the email_user task can be called with valid parameters
    and that it has the expected status and arguments when executed. It does not verify the actual sending of the email,
    as that would require integration testing with an email backend.
    """
    from_email = "no-reply@example.com"
    to_email = "user@example.com"
    subject = "Test Email"
    message = "<p>This is a test email.</p>"

    result = email_user.enqueue(from_email, to_email, subject, message)
    default_task_backend.get_result(result.id)
    assert result.status == TaskResultStatus.READY
    assert result.args == [from_email, to_email, subject, message]
