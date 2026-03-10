# SPDX-License-Identifier: AGPL-3.0-or-later

FROM python:3.13-alpine

WORKDIR /app

# Runtime dependencies: curl (for tests/health checks), clamav for clamd
# Clamav checks malware dictionary for updates when the container starts/runs.
RUN apk add --no-cache \
    curl \
    clamav && \
    mkdir -p /run/clamav /var/run/clamav /var/lib/clamav && \
    chown -R clamav:clamav /run/clamav /var/run/clamav /var/lib/clamav

COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv
ENV UV_LINK_MODE=copy
ENV UV_SYSTEM_PYTHON=true

COPY ./pyproject.toml ./uv.lock* ./
RUN uv sync --frozen --no-dev

COPY . .
RUN chmod +x /app/entrypoint.sh

EXPOSE 9101

# Entrypoint starts clamd, waits for socket, then runs uvicorn
CMD ["/app/entrypoint.sh"]
