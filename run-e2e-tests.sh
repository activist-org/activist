#!/usr/bin/env bash
# Run the activist end-to-end test suite.
#
# Usage: ./run-e2e-tests.sh [options] [-- <playwright args>]
# (or equivalently: sh run-e2e-tests.sh / bash run-e2e-tests.sh)
#
# Run `./run-e2e-tests.sh -h` for the authoritative list of flags and examples.
# Windows users: please run this script inside WSL.
#
# Implementation note: the shebang is bash because the spinner uses bash
# substring syntax. Invoking as `sh run-e2e-tests.sh` still works on macOS
# (where /bin/sh is bash) but the shebang is the portable path.

# Resolve the repo root once so the EXIT trap can tear down Docker no matter
# which directory the script is in when it exits (e.g. after `cd frontend`).
REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"

E2E_FILE=""
E2E_PLATFORM_DESKTOP=0
E2E_PLATFORM_MOBILE=0
SKIP_BUILD=0
NO_CLEANUP=0
PASSTHROUGH=()
SPINNER_PID=""

# Guaranteed cleanup on any exit path (normal exit, Ctrl-C, or error). Without
# this, aborted runs leave Docker containers up and the preview server holding
# port 3000, forcing users to clean up by hand.
cleanup() {
  rc=$?
  trap - EXIT INT TERM
  # Always stop the spinner so the terminal is usable regardless of mode.
  if [ -n "$SPINNER_PID" ]; then
    kill "$SPINNER_PID" 2>/dev/null || true
    wait "$SPINNER_PID" 2>/dev/null || true
  fi
  # --no-cleanup/--keep-up: leave Docker (and the preview server, on normal
  # exit) running for debugging. On Ctrl-C the preview server dies with the
  # rest of the foreground process group; Docker survives because it's
  # detached. Test for the running server so the message is accurate.
  if [ "$NO_CLEANUP" -eq 1 ]; then
    printf '\n' >&2
    if lsof -ti tcp:3000 >/dev/null 2>&1; then
      echo "run-e2e-tests.sh: --no-cleanup set; Docker and preview server left running." >&2
    else
      echo "run-e2e-tests.sh: --no-cleanup set; Docker left running (preview server exited with the run)." >&2
    fi
    echo "Clean up manually when done:" >&2
    echo "  lsof -ti tcp:3000 | xargs kill -9 2>/dev/null" >&2
    echo "  (cd \"$REPO_ROOT\" && docker compose --env-file .env.dev down)" >&2
    exit "$rc"
  fi
  lsof -ti tcp:3000 2>/dev/null | xargs kill -9 2>/dev/null || true
  (cd "$REPO_ROOT" && docker compose --env-file .env.dev down) >/dev/null 2>&1 || true
  exit "$rc"
}
trap cleanup EXIT INT TERM

usage() {
  cat <<'EOF'
Usage: ./run-e2e-tests.sh [options] [-- <playwright args>]

Options:
  -f <path>         Run a single Playwright spec file instead of the full suite.
                    <path> may be:
                      - relative to frontend/ (e.g. test-e2e/specs/all/foo.spec.ts),
                      - prefixed with frontend/ when given from the repo root, or
                      - an absolute path to the spec file.
  -d                Run desktop tests only (Playwright project: Desktop Chrome).
  -m                Run mobile tests only  (Playwright project: Mobile Chrome).
  -s, --skip-build  Skip yarn install + yarn build:local and reuse the existing
                    frontend/.output/ build. Fails if no build is present.
  --no-cleanup      Leave Docker containers (and, on normal exit, the preview
    (--keep-up)     server) running after the script exits, so you can poke
                    at the DB or re-run Playwright manually. Prints manual
                    cleanup commands on exit. Note: if you Ctrl-C mid-run,
                    SIGINT kills the preview server directly (Docker survives
                    because it's not in the foreground process group).
  -h, --help        Print this message and exit (does not start Docker or tests).

Anything after `--` is forwarded to `npx playwright test`. Useful for:
  --headed  --debug  --ui  -g "<name>"  --repeat-each N  --update-snapshots

If neither -d nor -m is passed, both desktop and mobile run.

Examples:
  ./run-e2e-tests.sh
  ./run-e2e-tests.sh -d
  ./run-e2e-tests.sh -f test-e2e/specs/all/foo.spec.ts
  ./run-e2e-tests.sh -f frontend/test-e2e/specs/all/foo.spec.ts -d
  ./run-e2e-tests.sh -s -f test-e2e/specs/all/foo.spec.ts -- --headed
  ./run-e2e-tests.sh -- --grep "qr code"
  ./run-e2e-tests.sh --no-cleanup -f test-e2e/specs/all/foo.spec.ts
EOF
}

while [ $# -gt 0 ]; do
  case "$1" in
    -f)
      if [ -z "${2:-}" ]; then
        echo "run-e2e-tests.sh: -f requires a file path" >&2
        exit 1
      fi
      E2E_FILE="$2"
      shift 2
      ;;
    -d)
      E2E_PLATFORM_DESKTOP=1
      shift
      ;;
    -m)
      E2E_PLATFORM_MOBILE=1
      shift
      ;;
    -s|--skip-build)
      SKIP_BUILD=1
      shift
      ;;
    --no-cleanup|--keep-up)
      NO_CLEANUP=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    --)
      # Everything after -- is forwarded verbatim to `npx playwright test`.
      shift
      PASSTHROUGH=("$@")
      break
      ;;
    *)
      echo "run-e2e-tests.sh: unknown option: $1" >&2
      echo "Try '-h' or '--help' for usage." >&2
      exit 1
      ;;
  esac
done

if [ "$E2E_PLATFORM_DESKTOP" -eq 0 ] && [ "$E2E_PLATFORM_MOBILE" -eq 0 ]; then
  E2E_PLATFORM_DESKTOP=1
  E2E_PLATFORM_MOBILE=1
fi

# Preflight checks: fail fast before touching Docker or the build.
# Work from the repo root so relative paths resolve deterministically no matter
# which directory the script was invoked from.
cd "$REPO_ROOT" || {
  echo "run-e2e-tests.sh: cannot cd to repo root: $REPO_ROOT" >&2
  exit 1
}

if [ ! -d frontend ]; then
  echo "run-e2e-tests.sh: expected a 'frontend' directory at $REPO_ROOT" >&2
  exit 1
fi

if [ ! -f .env.dev ]; then
  echo "run-e2e-tests.sh: missing .env.dev at $REPO_ROOT (copy from .env.dev.example)" >&2
  exit 1
fi

# -s/--skip-build requires an existing build. Checked here (before Docker) so
# a fresh clone with `-s` fails in milliseconds instead of after ~4s of Docker
# startup.
if [ "$SKIP_BUILD" -eq 1 ] && [ ! -f frontend/.output/server/index.mjs ]; then
  echo "run-e2e-tests.sh: -s/--skip-build requires an existing build at frontend/.output/server/index.mjs" >&2
  echo "Run once without -s, or run 'yarn build:local' manually first." >&2
  exit 1
fi

# Resolve the optional -f spec path before starting Docker so a typo does not
# waste the time needed to bring up backend + db.
PLAYWRIGHT_SPEC=""
if [ -n "$E2E_FILE" ]; then
  ef="$E2E_FILE"
  case "$ef" in
    ./*) ef="${ef#./}" ;;
  esac

  case "$ef" in
    /*)
      if [ -f "$ef" ]; then
        PLAYWRIGHT_SPEC="$ef"
      fi
      ;;
    *)
      # Prefer frontend-relative, then strip a leading frontend/ if the user
      # pasted a repo-root path. Result is always a path valid from frontend/.
      if [ -f "frontend/$ef" ]; then
        PLAYWRIGHT_SPEC="$ef"
      else
        stripped="${ef#frontend/}"
        if [ "$stripped" != "$ef" ] && [ -f "frontend/$stripped" ]; then
          PLAYWRIGHT_SPEC="$stripped"
        fi
      fi
      ;;
  esac

  if [ -z "$PLAYWRIGHT_SPEC" ]; then
    echo "run-e2e-tests.sh: spec file not found: $E2E_FILE" >&2
    echo "Hint: paths are resolved from frontend/ (e.g. test-e2e/specs/...) or use frontend/... from repo root." >&2
    exit 1
  fi
fi

# Start the backend and database (USE_PREVIEW skips full build inside Docker).
# Fail fast if Docker itself is unreachable, otherwise we'd waste ~2 minutes
# on the frontend build only to hit a misleading "frontend did not become ready"
# error downstream.
USE_PREVIEW=true docker compose --env-file .env.dev up backend db -d || {
  echo "run-e2e-tests.sh: failed to start Docker services (is the Docker daemon running?)" >&2
  exit 1
}

# Set the environment variables and run the frontend:
cd frontend || {
  echo "run-e2e-tests.sh: cannot cd to frontend/" >&2
  exit 1
}
set -a && . ../.env.dev && set +a

# USE_PREVIEW=true switches the Nitro preset to node-server (outputs to .output/)
# so that `yarn preview` (nuxi preview) can serve it. Without this, the build
# uses the netlify-static preset (outputs to dist/) and yarn preview fails.
export USE_PREVIEW=true

# Install dependencies and build + serve the frontend in preview mode.
# -s / --skip-build reuses the existing .output/ build for fast iteration
# (existence of .output/server/index.mjs is verified in the preflight block).
if [ "$SKIP_BUILD" -eq 1 ]; then
  echo "Skipping build; serving existing .output/server/index.mjs"
else
  corepack enable
  yarn install
  # Remove any previous static build so nuxi preview uses .output/ (node-server) not dist/ (netlify-static).
  rm -rf dist
  echo "Building frontend (this takes ~2 minutes)..."
  yarn build:local
fi
echo "Starting frontend server..."
# Kill any leftover server from a previous run using lsof directly (yarn kill-port can block).
lsof -ti tcp:3000 | xargs kill -9 2>/dev/null || true
# Start the node server directly with explicit env vars.
# nohup yarn preview strips env vars in some shells; node directly is reliable.
nohup env NUXT_SESSION_PASSWORD="$NUXT_SESSION_PASSWORD" NUXT_API_SECRET="" node .output/server/index.mjs > /dev/null 2>&1 &
# Remove the node job from bash's job table so SIGKILL during cleanup does not
# print a "Killed: 9" notification after the test summary.
disown 2>/dev/null || true

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

ready=0
for i in $(seq 1 30); do
  if curl -sf http://localhost:3000/ > /dev/null 2>&1; then
    kill "$SPINNER_PID" 2>/dev/null || true
    wait "$SPINNER_PID" 2>/dev/null || true
    SPINNER_PID=""
    printf "\rFrontend ready.          \n"
    ready=1
    break
  fi
  sleep 2
done

# Abort rather than run Playwright against a dead port; the trap handles teardown.
if [ "$ready" -ne 1 ]; then
  printf "\n" >&2
  echo "run-e2e-tests.sh: frontend did not become ready on http://localhost:3000 within 60s" >&2
  exit 1
fi

# Run the e2e test suite (SKIP_WEBSERVER tells Playwright to reuse the running server):
export SKIP_WEBSERVER=true
export TEST_ENV=local

# Build the --project=... arguments. PROJECT_ARGS is only consumed by the npx
# branch below; the `yarn test:local*` branches select projects internally via
# the scripts in frontend/package.json.
PROJECT_ARGS=()
MODES=""
if [ "$E2E_PLATFORM_DESKTOP" -eq 1 ]; then
  PROJECT_ARGS+=(--project='Desktop Chrome')
  MODES="Desktop Chrome"
fi
if [ "$E2E_PLATFORM_MOBILE" -eq 1 ]; then
  PROJECT_ARGS+=(--project='Mobile Chrome')
  MODES="${MODES:+$MODES, }Mobile Chrome"
fi

# Note "<full suite>" in the Spec line when passthrough args actually filter
# the run (--grep, -g, --grep-invert, --shard) so the log isn't misleading.
spec_display="${PLAYWRIGHT_SPEC:-<full suite>}"
if [ -z "$PLAYWRIGHT_SPEC" ] && [ ${#PASSTHROUGH[@]} -gt 0 ]; then
  for arg in "${PASSTHROUGH[@]}"; do
    case "$arg" in
      -g|--grep|--grep-invert|--shard|--shard=*)
        spec_display="<full suite, filtered by passthrough>"
        break
        ;;
    esac
  done
fi

echo "Running: $MODES"
echo "Spec:    $spec_display"
if [ ${#PASSTHROUGH[@]} -gt 0 ]; then
  echo "Extra:   ${PASSTHROUGH[*]}"
fi

# Capture Playwright's exit code so a failing test run returns non-zero.
# `yarn test:local:merge` is best-effort and must not mask a failing test run.
# When a spec or passthrough args are provided, route through npx directly so
# the args flow through (yarn's compound scripts don't forward --args cleanly).
rc=0
if [ -n "$PLAYWRIGHT_SPEC" ] || [ ${#PASSTHROUGH[@]} -gt 0 ]; then
  if [ -n "$PLAYWRIGHT_SPEC" ]; then
    npx playwright test "${PROJECT_ARGS[@]}" "$PLAYWRIGHT_SPEC" "${PASSTHROUGH[@]}" || rc=$?
  else
    npx playwright test "${PROJECT_ARGS[@]}" "${PASSTHROUGH[@]}" || rc=$?
  fi
elif [ "$E2E_PLATFORM_DESKTOP" -eq 1 ] && [ "$E2E_PLATFORM_MOBILE" -eq 1 ]; then
  yarn test:local || rc=$?
elif [ "$E2E_PLATFORM_DESKTOP" -eq 1 ]; then
  rm -rf blob-report
  yarn test:local:desktop || rc=$?
  yarn test:local:merge || true
else
  rm -rf blob-report
  yarn test:local:mobile || rc=$?
  yarn test:local:merge || true
fi

# Cleanup (port 3000 + docker compose down) is handled by the EXIT trap.
exit "$rc"
