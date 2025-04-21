# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Models for the communities app.
"""

from django.db import models

# MARK: Main Tables


class Status(models.Model):
    """
    Represent the status of a user within a specific organization.
    """

    status_type = models.ForeignKey("StatusType", on_delete=models.CASCADE)
    org = models.ForeignKey(
        "communities.Organization",
        on_delete=models.CASCADE,
        related_name="org_status",
    )
    user = models.ForeignKey("authentication.UserModel", on_delete=models.CASCADE)

    def __str__(self) -> str:
        """
        Return the string representation of the status object.

        Returns
        -------
        str
            The string representation of the status object.
        """
        return f"{self.org.name} - {self.status_type}"


# MARK: Bridge Tables


class StatusType(models.Model):
    """
    Describe the possible types of user statuses within organizations.
    """

    name = models.CharField(max_length=255)

    def __str__(self) -> str:
        """
        Return the name of the status type.

        Returns
        -------
        str
            The name of the status type.
        """
        return self.name
