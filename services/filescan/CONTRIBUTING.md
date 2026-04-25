<a id="top"></a>

# [Contributing to the activist filescan service](https://github.com/activist-org/activist/tree/main/services/filescan/CONTRIBUTING.md)

## Contents

- [Building the project](#building-the-project)
- [Testing](#testing)
  - [Environment](#environment)
  - [Unit tests](#unit-tests)
  - [Integration tests](#integration-tests)
  - [Test files](#test-files)

## Building the project

The steps below are for **local development** only. In production the service is typically run via a docker-compose file.

When running as part of the wider project (e.g. via docker-compose), ensure the project’s `.env` file includes:

- **`FILESCAN_PORT`**: Port the filescan service listens on inside the container that docker-compose maps to the host. Default is `9101`. Used by the main [docker-compose.yml](../../docker-compose.yml) for the `filescan` service port mapping and `healthcheck`. The backend reaches the service via `FILESCAN_BASE_URL` or `FILESCAN_URL` (see [INTEGRATION_NOTES.md](./INTEGRATION_NOTES.md)); in the integration override these are set to `http://filescan:9101` (and `.../scan`), matching the default port.

From `services/filescan` run the following:

- **Build:**

  ```bash
  docker build -t filescan-service .
  ```

- **Run:**

  ```bash
  docker run --rm -p 9101:9101 filescan-service
  ```

The service listens on port 9101. Use `-d` to run in the background.

When exercising full backend to filescan integration locally, you will typically run the service as part of the main stack rather than as an ad‑hoc container. From the project root, use the `docker compose ... -f docker-compose.yml -f docker-compose.filescan_integration.yml ...` commands documented in the project readme that do the following:

- The backend can reach filescan at `http://filescan:9101/scan`.
- The internal security events endpoint (`POST /internal/security-events`) is available to receive events from filescan.

<sub><a href="#top">Back to top.</a></sub>

## Testing

### Environment

Run the following commands before running any tests for the first time within `services/filescan` to create and activate the virtual environment:

  ```bash
  uv sync --all-extras  # create .venv and install all dependencies from uv.lock

  # Unix or macOS:
  source .venv/bin/activate

  # Windows:
  .venv\Scripts\activate.bat  # .venv\Scripts\activate.ps1 (PowerShell)
  ```

Then use `uv run pytest` for the commands below.

### Unit tests

- Location: `services/filescan/tests/`
- Description: Exercise the FastAPI endpoints and response shapes using a mocked ClamAV client (no real `clamd` required).
- Run from `services/filescan`:

  ```bash
  uv run pytest tests
  ```

### Integration tests

- Location: `services/filescan/tests_integration/`
- Description: Call the running service over HTTP and exercise a real ClamAV daemon inside the container using the same test files.
- A `filescan-service` container must be running and reachable before you run these tests; see **Build and run (Docker)** above.
- Run from `services/filescan`:

  ```bash
  uv run pytest tests_integration
  ```

### Test files

- Test assets live in `services/filescan/tests/test_files/`:
  - `clean.txt`, `empty.txt`, `large_clean.txt` — benign content (ClamAV reports clean).
  - `fake_image.bin` — non-image binary sent as image (tests binary handling).
- **EICAR**: The industry-standard EICAR test payload is **not** committed as a file (repository scanners correctly flag it). Tests build the 68-byte string in memory via `tests/eicar_payload.py` and upload it as `eicar.txt`. That string is harmless and lets AV engines (including ClamAV) report a positive hit so you can verify end-to-end scanning without real malware.

<sub><a href="#top">Back to top.</a></sub>
