#!/usr/bin/env bash

set -o errexit
set -o pipefail
cmd="$@"

function postgres_ready() {
  python <<END
import sys
import psycopg2
import environ

try:
    env = environ.Env()
    dbname = env.str('POSTGRES_DB')
    user = env.str('POSTGRES_USER')
    password = env.str('POSTGRES_PASSWORD')
    conn = psycopg2.connect(dbname=dbname, user=user, password=password, host='postgres', port=5432)
except psycopg2.OperationalError:
    sys.exit(-1)
sys.exit(0)
END
}

until postgres_ready; do
  echo >&2 "Postgres is unavailable - sleeping"
  sleep 1
done

echo >&2 "Postgres is up - continuing..."
exec $cmd
