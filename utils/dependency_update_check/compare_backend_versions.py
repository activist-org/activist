# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Ran as a part of the dependency_update_check GitHub Action to derive potential backend updates.
"""

import re
import subprocess


def capture_and_pint_uv_upgrades() -> None:
    """
    Capture the output of uv lock --upgrade to derive potential backend package upgrades.

    Returns
    -------
    None
        The package names, their new version and their old version are printed.
    """
    result = subprocess.run(
        ["uv", "lock", "--upgrade"], capture_output=True, text=True, check=True
    )

    combined_output = result.stdout + "\n" + result.stderr

    # Matches: "Updated <dep> <old_ver> -> <new_ver>".
    pattern = re.compile(r"Updated\s+(\S+)\s+v?(\S+)\s+->\s+v?(\S+)")

    for line in combined_output.splitlines():
        if match := pattern.search(line):
            dep, old_ver, new_ver = match.groups()

            print(f"| {dep} | {old_ver} | {new_ver} | Backend |")


if __name__ == "__main__":
    capture_and_pint_uv_upgrades()
