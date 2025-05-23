# SPDX-License-Identifier: AGPL-3.0-or-later
import os
import sys

from utils import run_shell_command

os.chdir("frontend")
if not sys.platform.startswith("win"):
    run_shell_command("corepack enable")

run_shell_command("yarn install")
run_shell_command("yarn format")
