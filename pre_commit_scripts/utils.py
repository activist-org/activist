# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Utility functions for pre-commit scripts.
"""

import subprocess
import sys


def run_shell_command(command: str):
    """
    Run a command from the shell to have it function across operating systems.

    Parameters
    ----------
    command : str
        The shell command to run.
    """
    result = subprocess.run(command, shell=True)
    if result.returncode != 0:
        sys.exit(result.returncode)
