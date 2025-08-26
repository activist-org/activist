FROM python:3.11-alpine3.16

# Set work dir for relative paths.
WORKDIR /app

# Copy code from context to image.
COPY . .

# Set env
ARG env=dev

# Install dependencies.
RUN pip install --upgrade pip

RUN if [ "$env" = "prod" ]; then \
    pip install -r requirements.txt; \
    else \
    pip install -r requirements-dev.txt; \
    fi

EXPOSE 8000/tcp

# Run django server
ENTRYPOINT ["sh", "-c", "python3 manage.py makemigrations && python3 manage.py migrate && python3 manage.py runserver 0.0.0.0:8000"]
