# Run this script to reset the local frontend environment to allow for local testing.
# macOS: sh frontend/reset_local_env.sh
# Linux: bash frontend/reset_local_env.sh
# Windows: Run the commands below.

# Replace local yarn.lock file with the one in main:
wget -O yarn.lock https://raw.githubusercontent.com/activist-org/activist/refs/heads/main/frontend/yarn.lock

# Clear the yarn cache system wide (might take a long time):
yarn cache clean

# Delete the node_modules folder:
rm -rf node_modules

# Load environment variables into your shell:
set -a && source ../.env.dev && set +a

# Reinstall and prompt to restart IDE:
yarn install
echo "Please restart your IDE to assure that changes are picked up."
