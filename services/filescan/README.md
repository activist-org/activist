# File Scan Service

FastAPI-based service that accepts file uploads over HTTP and scans them with ClamAV. Other scan types (eg CSAM) can be easily added.

The service runs a `clamd` daemon **inside the same container** and talks to it over a Unix socket.

On startup, the container updates the ClamAV malware signature database before accepting requests. You can adjust this behavior by editing the `freshclam 2>/dev/null || true` line in [`entrypoint.sh`](./entrypoint.sh).

Uploaded files are read into memory and passed to ClamAV; the result is returned as JSON indicating whether malware was detected and, if so, which signature matched.

The service also runs a **CSAM scan**; that path is **stubbed** in code (it always reports clean) and is intended to be wired later to an approved hash or API service (e.g. PhotoDNA). For detailed notes on CSAM options, legal considerations, and implementation approaches, see [`CSAM_IMPLEMENTATION_NOTES.md`](./CSAM_IMPLEMENTATION_NOTES.md).

Both scanners are implemented as async functions that run their work in background threads via the FastAPI event loop so that multiple `/scan` requests can be processed concurrently.

Within the wider project, this service uses a **9100-series port** (`9101` by default). It is suggested that all services in the project—including this one—use ports in the 9100 range, so as to avoid port collisions with each other and with other software in the future.

## Alternatives to ClamAV

This service currently uses **ClamAV** for malware scanning. Other options you might consider (as replacements or in addition) include: **VirusTotal**, **Cloudmersive**, **Opswat**, **Scanii**, and **MultiAV**. For offloading scan work to background tasks, **Celery** can be used as a 'task runner' to run scans asynchronously. Evaluation of any alternative should take into account licensing, cost, privacy, and whether the engine runs on-premises or via a third-party API.

## Integration with activist backend

How this service fits into the wider upload flow (quarantine volume, who quarantines, backend responsibilities, and Django/DRF integration) is documented in **[INTEGRATION_NOTES.md](./INTEGRATION_NOTES.md)**.

When malware is detected and quarantined, this service also emits a structured security event to the backend over HTTP:

- Events are sent to the backend’s internal ingestion endpoint at `POST /internal/security-events`.
- Access to this endpoint is controlled via a shared secret header (`X-Internal-Token`) and is intended only for trusted internal services, not public clients.
- The backend then translates accepted events into operator alerts (e.g. console emails in development, real notification channels in staging/production, depending on configuration).

The JSON envelope for these events is described by `SecurityEventEnvelopeSerializer` in the backend (see `backend/core/serializers.py`), but the ingest view in `backend/core/internal_events.py` also performs additional runtime validation before dispatching alerts. For a concrete example payload, and details of the email alert behaviour, see **[INTEGRATION_NOTES.md](./INTEGRATION_NOTES.md)**.

## Build and run (Docker)

The steps below are for **local development** only. In production the service is typically run via a docker-compose file.

When running as part of the wider project (e.g. via docker-compose), ensure the project’s `.env` file includes:

- **`FILESCAN_PORT`** — Port the filescan service listens on inside the container and that docker-compose maps to the host. Default is `9101`. Used by the main `docker-compose.yml` for the `filescan` service port mapping and healthcheck. The backend reaches the service via `FILESCAN_BASE_URL` or `FILESCAN_URL` (see [INTEGRATION_NOTES.md](./INTEGRATION_NOTES.md)); in the integration override these are set to `http://filescan:9101` (and `.../scan`), matching the default port.

From `services/filescan`:

- **Build:**
  ```bash
  docker build -t filescan-service .
  ```
- **Run:**
  ```bash
  docker run --rm -p 9101:9101 filescan-service
  ```
  The service listens on port 9101. Use `-d` to run in the background.

When exercising full backend ↔ filescan integration locally, you will typically run the service as part of the main stack rather than as an ad‑hoc container. From the project root, use the `docker compose ... -f docker-compose.yml -f docker-compose.filescan_integration.yml ...` commands documented in **[INTEGRATION_NOTES.md](./INTEGRATION_NOTES.md)** so that:

- The backend can reach filescan at `http://filescan:9101/scan`.
- The internal security events endpoint (`POST /internal/security-events`) is available to receive events from filescan.


## Endpoints

- **OpenAPI documentation**
  - FastAPI exposes an interactive OpenAPI UI for this service at `GET /docs`, showing the `/health` and `/scan` endpoints, their request/response schemas, and example payloads. This documentation can be previewed at:
  ```bash
  http://localhost:9101/docs
  ```

- **Health check**
  - `GET /health` → `{"status": "ok"}` if the service is up.

- **Malware scan**
  - `POST /scan` with `multipart/form-data` and a `file` field. The service runs both ClamAV (malware) and a CSAM scan (currently a stub; intended for an approved hash/API service e.g. PhotoDNA). If any scanner reports a hit, the response has `malware_detected: true` and an optional `source` field (`"clamav"` or `"csam"`).
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
          "detail": "Malware detected by ClamAV.",
          "quarantine_id": "0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c",
          "quarantine_available": true
        }
        ```

## Tests

> Before running any tests for the first time, run `uv sync` from `services/filescan` to create the project virtual environment and install dependencies. Then use `uv run pytest ...` for the commands below (no need to activate the venv).

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
  - A `filescan-service` container must be running and reachable before you run these tests; see **Build and run (Docker)** above.
  - Run from `services/filescan`:
    ```bash
    uv run pytest tests_integration
    ```

- **Test files and manual checks**
  - Test assets live in `services/filescan/tests/test_files/`:
    - `clean.txt`, `empty.txt`, `large_clean.txt` — benign content (ClamAV reports clean).
    - `fake_image.bin` — non-image binary sent as image (tests binary handling).
  - **EICAR**: The industry-standard EICAR test payload is **not** committed as a file (repository scanners correctly flag it). Tests build the 68-byte string in memory via `tests/eicar_payload.py` and upload it as `eicar.txt`. That string is harmless and lets AV engines (including ClamAV) report a positive hit so you can verify end-to-end scanning without real malware.
## CSAM implementation and broader content safety pipeline

The service is designed to support CSAM detection through a separate scanner implemented in `scanners/csam.py` and wired into the `/scan` endpoint alongside ClamAV.

At present, the CSAM path is stubbed (it always reports clean) and is intended to be wired to an approved hash‑based or API‑based CSAM detection service (for example, a PhotoDNA‑style cloud service or a vetted hash‑matching daemon provided by a hotline or clearinghouse).

For detailed design considerations, options, and testing strategy for CSAM integration, see:

- [`CSAM_IMPLEMENTATION_NOTES.md`](./CSAM_IMPLEMENTATION_NOTES.md)

### Additional scan types to consider

Over time, this service can evolve into a more general **content safety pipeline**, where multiple scanners run over the same upload and contribute to a single safety decision. In addition to malware and CSAM hash‑matching, candidates include:

- **MIME/type validation**
  - Validate that the declared content type and file extension match the actual bytes (magic numbers, image headers, etc.).
  - Useful for catching spoofed uploads (e.g. `.jpg` that is really a script or archive).

- **NSFW / adult‑content classifier**
  - Use a model or service that scores images for nudity or other NSFW content.
  - Intended for general explicit‑content filtering; not a replacement for vetted CSAM hash‑matching.

- **OCR scanner**
  - Extract text from images or PDFs (e.g. via Tesseract or an OCR API) and run the text through profanity, hate‑speech, or keyword filters.
  - Helps catch policy violations embedded in images rather than filenames alone.

- **Archive / zip‑bomb detection**
  - Inspect archives (ZIP, TAR, etc.) for characteristics of decompression bombs (deeply nested structures, extreme compression ratios).
  - Apply limits or reject archives that exceed safe thresholds before full extraction.

- **“Pixel decoding” / re‑encode checks**
  - Decode images and re‑encode them using safe, standardized settings (e.g. strip metadata, normalize color profiles, enforce size limits).
  - Can help detect or mitigate steganography or malformed image payloads by ensuring the stored version is a clean re‑encode of decoded pixels.

These additional scanners can follow the same pattern as existing ones: accept raw bytes, return a structured result (score, flags, or “detected” boolean plus metadata), and be orchestrated by the FastAPI endpoint to produce a unified response for the backend.

## To Do

- **HTTP method hardening tests for filescan port (`9101`)**
  - Add explicit tests that probe `http://localhost:9101` using non-supported HTTP methods (for example `PUT`, `PATCH`, `DELETE`, `OPTIONS`, `TRACE`) against `/scan` and `/health`, and assert only intended methods are accepted while others return sensible error codes (for example `405 Method Not Allowed`).

- **Quarantine integration test cleanup**
  - The test in `tests_integration/test_scan_quarantine_integration.py` should confirm the quarantined file exists on disk (e.g. in the host-visible quarantine folder) and delete it when the test finishes. Currently the test can leave a file in the quarantine folder; revisit and fix so the test reliably asserts and cleans up.

- **System-level logging and observability**
  - Implemented: INFO-level logging for scan requests (filename, size, content_type), scan responses (status, malware_detected, detail, source), and WARNING/ERROR for 400/503.

  - No log contents are logged elsewhere. Logs go to stderr (also visible in Docker filescan container logs).

- **OpenAPI / API documentation**
  - FastAPI provides basic OpenAPI documentation by default. When the `filescan` container is built and running, this documentation can be previewed at
  ```bash
  http://localhost:9101/docs
  ```
  - Need to check if the project-wide OpenAPI stuff integrates this filescan doc.
- **Quarantine volume for violating files**
  - Establish a dedicated, access-controlled quarantine storage location (volume or bucket) for files where malware or CSAM is detected.
  - This service uses the `FILESCAN_QUARANTINE_DIR` environment variable to determine the on-disk quarantine directory (default `/var/filescan/quarantine`) and, when `malware_detected` is `true`, writes the uploaded bytes there under a generated `quarantine_id`.
  - The `/scan` response for detected files includes `quarantine_id` (and `quarantine_available: true`) so that operators can correlate API responses with quarantined files, while the exact filesystem path is only recorded in logs.
  - Need to revisit this volume mapping when we deploy. Best solution would map to a hardened, secured storage place that can safely store malware/other quarantined files.

- **General content moderation**
  - Decide if we want to implement some type of general content moderation scanning (ie "adult content", images of violence, etc.).

- **Notification and alerting**
  - Design and implement a notification pipeline (e.g. message queue, webhook, or email integration) to alert appropriate operators or downstream systems when malware or CSAM is detected.
  - As a first step, the service exposes a `notify_malware_quarantined(event: dict)` hook that currently logs a structured \"malware quarantined\" event; this can be extended later to send real notifications without changing the core `/scan` logic.

- **CSAM service integration and configuration**
  - Select and integrate an approved CSAM detection service (hash-based or API-based), wire it into `scanners/csam.py`, and add environment-driven configuration (endpoints, credentials, timeouts) plus clear operational documentation (see [`CSAM_IMPLEMENTATION_NOTES.md`](./CSAM_IMPLEMENTATION_NOTES.md) for detailed design notes).

- **Abuse prevention, access control, and limits**
  - Define authentication/authorization for access to the `/scan` endpoint.

- **Compliance, retention, and reporting workflows**
  - Document and implement policies around data retention (including how long quarantined files and logs are kept), legal reporting obligations for CSAM, and operator playbooks for handling detections in different jurisdictions.
