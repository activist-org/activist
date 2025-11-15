# Run this script to run the activist e2e test suite.
# macOS: sh run-e2e-tests.sh
# Linux: bash run-e2e-tests.sh
# Windows: Please download WSL and run the Linux command above.

# Run tests in the preview mode (much faster and uses less resources):
USE_PREVIEW=true docker compose --env-file .env.dev up backend db -d

# Set the environment variables and run the frontend:
cd frontend
set -a && source ../.env.dev && set +a

# Install and run the project in production mode:
corepack enable
yarn install
yarn build
nohup npx serve dist/ > /dev/null 2>&1 &

# Run the e2e test suite:
yarn test:local

# Stop the Docker and NPX processes:
yarn kill-port 3000

cd ..
docker compose --env-file .env.dev down
