# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Runs all i18n checks for the project.

Usage:
    python3 frontend/i18n/check/run_i18n_checks.py
"""

import subprocess
from pathlib import Path


def run_check(script_name):
    """
    Runs a check script and reports the results via the terminal.

    Parameters
    ----------
    script_name : str
        The filename for the script to run.

    Raises
    -------
    subprocess.CalledProcessError
        An error that the given check script has failed.
    """
    try:
        subprocess.run(
            ["python", Path("frontend") / "i18n" / "check" / script_name], check=True
        )
        print(f"{script_name} ran successfully.")

    except subprocess.CalledProcessError as e:
        print(f"Error running {script_name}: {e}")
        raise


def main():
    checks = [
        "i18n_check_key_identifiers.py",
        "i18n_check_non_source_keys.py",
        "i18n_check_unused_keys.py",
        "i18n_check_repeat_values.py",
        "i18n_check_map_object.py",
    ]

    for check in checks:
        run_check(check)


if __name__ == "__main__":
    main()
