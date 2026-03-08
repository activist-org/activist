# Run this script to run the activist e2e test suite.
# macOS: sh run-e2e-tests.sh
# Linux: bash run-e2e-tests.sh
# Windows: Please download WSL and run the Linux command above.

# Start the backend and database (USE_PREVIEW skips full build inside Docker):
USE_PREVIEW=true docker compose --env-file .env.dev up backend db -d

# Set the environment variables and run the frontend:
cd frontend
set -a && source ../.env.dev && set +a

# USE_PREVIEW=true switches the Nitro preset to node-server (outputs to .output/)
# so that `yarn preview` (nuxi preview) can serve it. Without this, the build
# uses the netlify-static preset (outputs to dist/) and yarn preview fails.
export USE_PREVIEW=true

# Install dependencies and build + serve the frontend in preview mode:
corepack enable
yarn install
# Remove any previous static build so nuxi preview uses .output/ (node-server) not dist/ (netlify-static).
rm -rf dist
echo "Building frontend (this takes ~2 minutes)..."
yarn build:local
echo "Starting frontend server..."
# Kill any leftover server from a previous run using lsof directly (yarn kill-port can block).
lsof -ti tcp:3000 | xargs kill -9 2>/dev/null || true
# Start the node server directly with explicit env vars.
# nohup yarn preview strips env vars in some shells; node directly is reliable.
nohup env NUXT_SESSION_PASSWORD="$NUXT_SESSION_PASSWORD" NUXT_API_SECRET="" node .output/server/index.mjs > /dev/null 2>&1 &

# Wait for the preview server to be ready before running tests.
# Spin a background progress indicator so it's clear the script is not hung.
(
  chars="/-\|"
  i=0
  while true; do
    i=$(( (i + 1) % 4 ))
    printf "\rWaiting for frontend... %s" "${chars:$i:1}"
    sleep 0.5
  done
) &
SPINNER_PID=$!

for i in $(seq 1 30); do
  if curl -sf http://localhost:3000/ > /dev/null 2>&1; then
    kill $SPINNER_PID 2>/dev/null
    wait $SPINNER_PID 2>/dev/null
    printf "\rFrontend ready.          \n"
    break
  fi
  sleep 2
done

# Run the e2e test suite (SKIP_WEBSERVER tells Playwright to reuse the running server):
SKIP_WEBSERVER=true yarn test:local

# Stop the frontend and Docker processes:
lsof -ti tcp:3000 | xargs kill -9 2>/dev/null || true

cd ..
docker compose --env-file .env.dev down
