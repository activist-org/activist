# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Command-line interface for type checking.
"""

import argparse
import sys

from .checker import TypeChecker


def main() -> None:
    """
    Main entry point.
    """
    parser = argparse.ArgumentParser(
        description="Check model fields against TypeScript types"
    )
    parser.add_argument("models_file", help="Path to models.py")
    parser.add_argument("types_file", help="Path to TypeScript types file")

    args = parser.parse_args()
    checker = TypeChecker(args.models_file, args.types_file)
    if missing := checker.check():
        print("Missing TypeScript fields found:")
        print("\n".join(missing))
        print(
            f"\nPlease correct the {len(missing)} fields above to have backend models and frontend types fully synced."
        )
        sys.exit(1)

    print("All model fields are properly typed in TypeScript!")


if __name__ == "__main__":
    main()
