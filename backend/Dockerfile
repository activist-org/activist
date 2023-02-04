FROM python:3.11.1-alpine3.16

# Set work dir for relative paths
RUN mkdir -p /app
WORKDIR /app

# Install dependencies
COPY ./backend/requirements.txt /app
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy code from context to image
COPY . .

CMD gunicorn backend.wsgi --bind 0.0.0.0
