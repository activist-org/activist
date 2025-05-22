# SPDX-License-Identifier: AGPL-3.0-or-later
import os
import subprocess
import sys

os.chdir("frontend")
yarn_format_command = subprocess.run(["yarn", "format"])
if yarn_format_command.returncode != 0:
    sys.exit(yarn_format_command.returncode)
