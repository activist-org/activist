FROM python:3.13-alpine

# Set work dir for relative paths.
WORKDIR /app

# Install uv.
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Copy from the cache instead of linking since it's a mounted volume.
ENV UV_LINK_MODE=copy
ENV UV_SYSTEM_PYTHON=true

# Install dependencies.
COPY ./pyproject.toml ./uv.lock* ./
RUN uv sync --frozen --no-dev

# Copy code from context to image.
COPY . .
