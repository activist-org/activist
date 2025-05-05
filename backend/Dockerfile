FROM python:3.11-alpine3.16

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY  . /app/.

# ... other configurations ...

CMD sh -c "python manage.py wait_for_db && \
    python manage.py makemigrations && \
    python manage.py migrate && \
    python manage.py loaddata fixtures/superuser.json && \
    python manage.py loaddata fixtures/status_types.json && \
    python manage.py loaddata fixtures/topics.json && \
    python manage.py populate_db --users 10 --orgs-per-user 1 --groups-per-org 1 --events-per-org 1 --resources-per-entity 1 --faq-entries-per-entity 1 && \
    python manage.py runserver 0.0.0.0:${BACKEND_PORT}"
