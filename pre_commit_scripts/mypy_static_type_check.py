# SPDX-License-Identifier: AGPL-3.0-or-later
import os

from utils import run_shell_command

os.chdir("backend")
run_shell_command("mypy . --config-file ./pyproject.toml")
