#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset

python manage.py migrate
python manage.py collectstatic --noinput --verbosity 0
gunicorn config.wsgi -w 4 --worker-class gevent -b 0.0.0.0:8000 --chdir=/app
