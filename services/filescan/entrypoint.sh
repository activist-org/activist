#!/bin/sh
# SPDX-License-Identifier: AGPL-3.0-or-later
# Ensure clamd socket dir exists, start clamd, wait for socket, then run the app.

set -e

SOCKET_PATH="${CLAMAV_SOCKET_PATH:-/run/clamav/clamd.sock}"
SOCKET_DIR="$(dirname "$SOCKET_PATH")"

mkdir -p "$SOCKET_DIR"
chown clamav:clamav "$SOCKET_DIR" 2>/dev/null || true

# Optional: update virus DB on startup (skip if no network or to speed startup)
# To toggle off, try commenting out this line.
freshclam 2>/dev/null || true

# Start clamd in background
clamd &

# Wait for socket to appear (clamd may need a few seconds to create it)
wait_time=0
max_wait=60
while [ $wait_time -lt $max_wait ]; do
  if [ -S "$SOCKET_PATH" ]; then
    break
  fi
  sleep 1
  wait_time=$((wait_time + 1))
done

if [ ! -S "$SOCKET_PATH" ]; then
  echo "clamd did not create socket at $SOCKET_PATH within ${max_wait}s" >&2
  exit 1
fi

exec uv run uvicorn main:app --host 0.0.0.0 --port 9101
