# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Background tasks for authentication-related email workflows.
"""

import logging

from django.core.mail import EmailMessage
from django.tasks import task

logger = logging.getLogger(__name__)


@task
def email_user(
    from_email: str,
    to: str,
    subject: str,
    message: str,
    cc: list[str] | None = None,
) -> int:
    """
    Used to send emails to users asynchronously.

    Parameters
    ----------
    from_email : str
        The email address of the sender.

    to : str
        The email address of the recipient.

    subject : str
        The subject of the email.

    message : str
        The body of the email.

    cc : list[str], optional
        A list of email addresses to be added as CC recipients.

    Returns
    -------
    int
        The number of successfully delivered messages (1 if successful, 0 otherwise).
    """
    email = EmailMessage(
        from_email=from_email, subject=subject, body=message, to=[to], cc=cc
    )
    email.content_subtype = "html"

    logger.info(f"Background task: E-Mail Verification - Sending email to {to}")
    return email.send()
