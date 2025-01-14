# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Models for the communities app.
"""

from django.db import models

# MARK: Main Tables


class Status(models.Model):
    status_type = models.ForeignKey("StatusType", on_delete=models.CASCADE)
    org = models.ForeignKey(
        "communities.Organization",
        on_delete=models.CASCADE,
        related_name="org_status",
    )
    user = models.ForeignKey("authentication.UserModel", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.org.name} - {self.status_type}"


# MARK: Bridge Tables


class StatusType(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.name
