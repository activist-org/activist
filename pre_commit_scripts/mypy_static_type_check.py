# SPDX-License-Identifier: AGPL-3.0-or-later
import os
import subprocess
import sys

os.chdir("backend")
mypy_config_file_command = subprocess.run(
    ["mypy", ".", "--config-file", "./pyproject.toml"]
)
if mypy_config_file_command.returncode != 0:
    sys.exit(mypy_config_file_command.returncode)
