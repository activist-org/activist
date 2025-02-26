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

    Returns
    -------
    bool
        Whether the given script passed or not from subprocess.run.check.

    Raises
    -------
    subprocess.CalledProcessError
        An error that the given check script has failed.
    """
    try:
        subprocess.run(
            ["python", Path("frontend") / "i18n" / "check" / script_name], check=True
        )
        return True

    except subprocess.CalledProcessError as e:
        print(f"Error running {script_name}: {e}")
        return False


def main():
    checks = [
        "i18n_check_invalid_keys.py",
        "i18n_check_key_identifiers.py",
        "i18n_check_non_source_keys.py",
        "i18n_check_unused_keys.py",
        "i18n_check_repeat_values.py",
    ]

    check_results = []
    check_results.extend(run_check(check) for check in checks)

    assert all(
        check_results
    ), "\nError: Some i18n checks did not pass. Please see the error messages above."

    print("\nSuccess: All i18n checks have passed!")


if __name__ == "__main__":
    main()
