FROM python:3.13-alpine

# Set work dir for relative paths.
WORKDIR /app

# Install uv.
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Install dependencies.
COPY ./pyproject.toml ./uv.lock* ./
RUN uv sync --frozen --no-dev

# Copy code from context to image.
COPY . .
