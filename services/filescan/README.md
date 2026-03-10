# File Scan Service

FastAPI-based microservice that accepts file uploads over HTTP and scans them with ClamAV.

The service runs a `clamd` daemon **inside the same container** and talks to it over a Unix socket.

On startup, the container automatically updates the ClamAV malware signature database before accepting requests.

Uploaded files are read into memory and passed to ClamAV; the result is returned as JSON indicating whether malware was detected and, if so, which signature matched.

## Local environment

Before running or testing this service locally, make sure you are using the **filescan-specific virtual environment**:

- From `services/filescan`:
  ```bash
  uv sync
  uv run python -c "import fastapi; print(fastapi.__version__)"  # optional sanity check
  ```
- Either keep using `uv run ...` (recommended), or activate the venv at `services/filescan/.venv` before running any Python commands by hand.

## Endpoints

- **Health check**
  - `GET /health` → `{"status": "ok"}` if the service is up.

- **Malware scan**
  - `POST /scan` with `multipart/form-data` and a `file` field:
    - On success, returns HTTP 200 with a body like:
      - Clean file:
        ```json
        {
          "filename": "example.png",
          "malware_detected": false,
          "detail": "No malware detected by ClamAV."
        }
        ```
      - Infected file:
        ```json
        {
          "filename": "eicar.com",
          "malware_detected": true,
          "signature": "Eicar-Test-Signature",
          "detail": "Malware detected by ClamAV."
        }
        ```

## Tests

- **Unit tests**
  - Location: `services/filescan/tests/`
  - Description: Exercise the FastAPI endpoints and response shapes using a mocked ClamAV client (no real `clamd` required).
  - Run from `services/filescan`:
    ```bash
    uv run pytest tests
    ```

- **Integration tests**
  - Location: `services/filescan/tests_integration/`
  - Description: Call the running service over HTTP and exercise a real ClamAV daemon inside the container using the same test files.
  - Requirements:
    - A `filescan-service` container must be running and reachable. From `services/filescan`:
      - Build:
        ```bash
        docker build -t filescan-service:0.1.0 .
        ```
      - Run:
        ```bash
        docker run --rm -p 9101:9101 filescan-service:0.1.0
        ```
  - Run from `services/filescan`:
    ```bash
    uv run pytest tests_integration
    ```
