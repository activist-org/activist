# SPDX-License-Identifier: AGPL-3.0-or-later
"""Test settings for backend pytest runs."""

import os

from core.settings import *  # noqa: F403

# Use explicit Postgres defaults for tests so database NAME/HOST/etc are never None.
# Values can still be overridden via environment variables.
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DATABASE_NAME", "activist_test"),
        "USER": os.getenv("DATABASE_USER", "postgres"),
        "PASSWORD": os.getenv("DATABASE_PASSWORD", "postgres"),
        "HOST": os.getenv("DATABASE_HOST", "localhost"),
        "PORT": os.getenv("DATABASE_PORT", "5432"),
    }
}
