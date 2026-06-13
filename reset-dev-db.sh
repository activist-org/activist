#!/usr/bin/env bash
# Reset the local development database to a fresh seeded state.
#
# Usage: ./reset-dev-db.sh
#
# Local data persists across docker compose restarts (see issue #2198), so use
# this script when you explicitly want to start over:
#   - If the backend container is running, the database is wiped and reseeded
#     in place (no restart needed).
#   - Otherwise the Postgres volume is removed, so the next
#     `docker compose --env-file .env.dev up` seeds a fresh database.

set -euo pipefail

cd "$(dirname "$0")"

if [ ! -f .env.dev ]; then
  echo "reset-dev-db.sh: missing .env.dev at $(pwd)" >&2
  exit 1
fi

compose() {
  docker compose --env-file .env.dev "$@"
}

if [ -n "$(compose ps --status running -q backend 2>/dev/null)" ]; then
  echo "Backend is running: wiping and reseeding the database in place..."
  # Keep these arguments in sync with the backend command in docker-compose.yml.
  # Without --skip-if-populated, populate_db clears all non-admin data first.
  compose exec backend uv run manage.py populate_db \
    --users 10 \
    --orgs-per-user 2 \
    --groups-per-org 2 \
    --events-per-org 1 \
    --events-per-group 1 \
    --faq-entries-per-entity 3 \
    --resources-per-entity 2 \
    --yaml-data-to-assign core/management/commands/entity_data_to_assign.yaml
  echo "Done. The database now contains only fresh seed data."
else
  echo "Backend is not running: removing containers and the database volume..."
  compose down -v
  echo "Done. Run 'docker compose --env-file .env.dev up' to start with a fresh database."
fi
