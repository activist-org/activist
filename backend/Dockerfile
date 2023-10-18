FROM python:3.11-alpine3.16

# Set work dir for relative paths
WORKDIR /app

# Install dependencies
COPY ./requirements-dev.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements-dev.txt

# Copy code from context to image
COPY . .
