# Run this script in the frontend directory to reset the local environment and allow for local testing.
# macOS: sh reset_local_env.sh
# Linux: bash reset_local_env.sh
# Windows: Run the commands below.

echo "Replacing local yarn.lock with the version on main..."
wget -O yarn.lock https://raw.githubusercontent.com/activist-org/activist/refs/heads/main/frontend/yarn.lock

echo "Cleaning yarn cache system wide. This might take a long time..."
yarn cache clean

echo "Deleting local node_modules directory..."
rm -rf node_modules
echo "Local node_modules deleted."

echo "Loading environment variables into your shell..."
set -a && source ../.env.dev && set +a
echo "Environment variables loaded."

echo "Reinstalling frontend dependencies..."
yarn install

echo "Local frontend environment restarted."
echo "Please restart your IDE to assure that changes are picked up."
