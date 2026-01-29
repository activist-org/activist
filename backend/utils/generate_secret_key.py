#!/usr/bin/env python
# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Utility script to generate secure Django SECRET_KEY for production deployments.

Usage:
    python backend/utils/generate_secret_key.py

This script generates a cryptographically secure random key suitable for use as
Django's SECRET_KEY in production environments.

Output can be used in:
    - Environment variables (e.g., SECRET_KEY environment variable)
    - .env files (e.g., .env.production)
    - Configuration management systems (e.g., Azure Key Vault, AWS Secrets Manager)

DO NOT use the same key for development and production!
DO NOT commit SECRET_KEY values to version control!
"""

import secrets
import string


def generate_secret_key(length: int = 50) -> str:
    """
    Generate a cryptographically secure random Django SECRET_KEY.

    Parameters
    ----------
    length : int, optional
        Length of the generated key (default: 50 characters).
        Django recommends at least 50 characters.

    Returns
    -------
    str
        A secure random string suitable for use as Django SECRET_KEY.
    """
    # Use a safe set of characters excluding quotes which might cause issues
    # when stored in shell scripts or .env files
    characters = (
        string.ascii_letters + string.digits + "!@#$%^&*(-_=+)"
    )
    return "".join(secrets.choice(characters) for _ in range(length))


if __name__ == "__main__":
    key = generate_secret_key()
    print("Generated SECRET_KEY:")
    print("=" * 70)
    print(key)
    print("=" * 70)
    print()
    print("Add this to your .env file:")
    print(f'SECRET_KEY="{key}"')
    print()
    print("Or set as environment variable:")
    print(f"export SECRET_KEY='{key}'")
