# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Package for checking Django models against TypeScript types.
"""

from .checker import TypeChecker
from .cli import main

__all__ = ["TypeChecker", "main"]
