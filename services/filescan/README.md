<a id="top"></a>

# [File Scan Service](https://github.com/activist-org/activist/tree/main/services/filescan/)

> [!IMPORTANT]
> See [MALWARE_DETECTED_RUNBOOK.md](./MALWARE_DETECTED_RUNBOOK) for incident processes.

[FastAPI-based](https://github.com/fastapi/fastapi) service that accepts file uploads over HTTP and scans them with ClamAV. Other scan types can be easily added.

## Contents

- [ClamAV scanner](#clamav-scanner)
  - [Process](#process)
  - [Alternatives](#alternatives)
- [Integration with activist backend](#integration-with-activist-backend)
  - [Quarantine storage](#quarantine-storage)
  - [Defining the quarantine path](#defining-the-quarantine-path)
  - [Persistence and restarts](#persistence-and-restarts)
  - [Notifications and logging](#notifications-and-logging)
  - [Backend security event ingestion](#backend-security-event-ingestion)
  - [Configuration](#configuration)
- [Integration commands](#integration-commands)
  - [Build images](#build-images)
  - [Start services](#start-services)
  - [Serializer and upload tests](#serializer-and-upload-tests)
  - [Backend to filescan integration tests](#backend-to-filescan-integration-tests)
- [HTTP Client](#http-client)
  - [Where the client lives](#where-the-client-lives)
  - [scan_file](#scan_file)
  - [Intended use](#intended-use)
  - [Current use](#current-use)
- [Endpoints](#endpoints)
  - [OpenAPI documentation](#openapi-documentation)
  - [Health check](#health-check)
  - [Malware scan](#malware-scan)
- [Additional scans to consider](#additional-scans-to-consider)
- [To Do](#to-do)

## ClamAV scanner

### Process

The service runs a `clamd` daemon **inside the same container** and talks to it over a Unix socket.

The Python application uses the [`clamav-client`](https://pypi.org/project/clamav-client/) package ([`clamav_client`](https://github.com/artefactual-labs/clamav-client) on GitHub) to connect to `clamd` via `INSTREAM` scans; the engine itself is the Alpine `clamav` package in the image.

On startup, the container updates the ClamAV malware signature database before accepting requests. You can adjust this behavior by editing the `freshclam 2>/dev/null || true` line in [`entrypoint.sh`](./entrypoint.sh).

Uploaded files are read into memory and passed to ClamAV; the result is returned as JSON indicating whether malware was detected and, if so, which signature matched.

Scanners are implemented as async functions that run their work in background threads via the FastAPI event loop so that multiple `/scan` requests can be processed concurrently.

Within the wider project, this service uses a **9100-series port** (`9101` by default). It is suggested that all services in the project—including this one—use ports in the 9100 range, so as to avoid port collisions with each other and with other software in the future.

<sub><a href="#top">Back to top.</a></sub>

### Alternatives

This service currently uses **ClamAV** for malware scanning. Other options include: **VirusTotal**, **Cloudmersive**, **Opswat**, **Scanii**, and **MultiAV**. For offloading scan work to background tasks, **Celery** can be used as a task runner to run scans asynchronously.

<sub><a href="#top">Back to top.</a></sub>

## Integration with activist backend

When malware is detected and quarantined, this service also emits a structured security event to the backend over HTTP:

- Events are sent to the backend’s internal ingestion endpoint at `POST /internal/security-events`.
- Access to this endpoint is controlled via a shared secret header (`X-Internal-Token`) and is intended only for trusted internal services, not public clients.
- The backend then translates accepted events into operator alerts (e.g. console emails in development, real notification channels in staging/production, depending on configuration).

The JSON envelope for these events is described by `SecurityEventEnvelopeSerializer` in the backend (see `backend/core/serializers.py`), but the ingest view in `backend/core/internal_events.py` also performs additional runtime validation before dispatching alerts. For a concrete example payload, and details of the email alert behaviour, see **[INTEGRATION_NOTES.md](./INTEGRATION_NOTES.md)**.

<sub><a href="#top">Back to top.</a></sub>

### Quarantine storage

Add the directory in the Dockerfile (no `VOLUME`); in local development, mount a host directory (bind mount) on that path via `docker-compose.yml` (e.g. `./quarantine:/var/quarantine`) so you can inspect quarantined files easily and they persist across restarts.

The filescan service quarantines on detection and owns logging + notifications (in filescan or a separate service under `services/`); backend never saves the file and, on a positive scan response, deletes its copy and stops processing.

<sub><a href="#top">Back to top.</a></sub>

### Defining the quarantine path

- **Dockerfile:** Create the directory (e.g. `RUN mkdir -p /var/quarantine` and set ownership). Do **not** add a `VOLUME` instruction; it doesn't give you the persistence you want.
- **docker-compose.yml (local dev):** Mount a host directory under the repo (e.g. `./quarantine:/var/quarantine`) so quarantine data survives restarts and can be inspected on the host. The Dockerfile only prepares the path; persistence comes from the compose bind mount (or whatever orchestrator you use).

You don't define the volume/mount in the Dockerfile. You do need the directory (and permissions) there. The actual quarantine persistence comes from how you run the container (e.g. bind mount in `docker-compose.yml`).

<sub><a href="#top">Back to top.</a></sub>

### Persistence and restarts

A directory created only in the Dockerfile does **not** persist across "compose down/up" or container replacement. A bind mount in docker-compose (or equivalent) gives you persistence for local development by mapping the container path to a host directory (e.g. `./quarantine`). In other environments you can use a named volume or storage class instead, as long as `/var/quarantine` (or your chosen path) is mounted to persistent storage.

<sub><a href="#top">Back to top.</a></sub>

### Notifications and logging

- **Logging** is enabled in the filescan service: `INFO` for each scan request (filename, size, content_type) `response` (status, malware_detected, detail, source), and `WARNING/ERROR` for 400/503. No file contents are logged; output goes to `stderr` (e.g. Docker container logs). In production, log output should be handled (e.g. aggregation, rotation, sampling, or raising the log level) so that high request volume does not produce an unbounded stream of entries.
- **Logging and alerting** for detections: when malware is detected, the filescan service should **log** the event in a structured way (timestamp, filename, signature/source, quarantine reference; no file contents or raw uploads) and perform any **alerting** (e.g. metrics, internal dashboards) as part of the same flow.
- **Notifications** should be triggered when a detection occurs (so that designated recipients—site/admin operators and any other designated users, e.g. security contacts—can act on the incident). When filescan gets a positive malware result, it POSTs a structured security event (including available metadata from the detection, such as filename, signature, detector, and quarantine identifier) to the backend’s internal ingestion endpoint (`POST /internal/security-events`). The backend is responsible for turning this event into concrete notifications (for example, via its existing SMTP/email configuration to send operator alerts), and can later fan this out to additional channels (webhooks, queues, dashboards) as needed.

<sub><a href="#top">Back to top.</a></sub>

### Backend security event ingestion

- When filescan quarantines a file (for example after a ClamAV malware hit), it can emit a structured event to the backend so that operators can be notified.
- These events are sent as JSON to the backend’s internal endpoint `POST /internal/security-events`, implemented by `SecurityEventIngestView` in `backend/core/internal_events.py`.
- The endpoint is intended for internal service-to-service communication:
  - Clients must include `X-Internal-Token: <INTERNAL_EVENTS_TOKEN>`; the backend compares this with its `INTERNAL_EVENTS_TOKEN` setting and rejects mismatches with HTTP 403.
  - In production, this path should also be restricted at the network/proxy layer (for example, only reachable on an internal network), and not exposed as part of the public API surface.
- The backend then translates accepted events into whatever notification channels are configured for that environment (for example, console output in local development and real email or paging channels in staging/production).

The expected request body is a **security event envelope** described by `SecurityEventEnvelopeSerializer` (see `backend/core/serializers.py`). Conceptually it looks like:

- Top-level envelope:
  - `type` — string identifying the event type (currently `malware_quarantined`).
  - `occurred_at` — ISO‑8601 timestamp for when the event occurred.
  - `source` — string identifying the source service (for example `"filescan"`).
  - `payload` — object with event‑specific fields.
- Payload for `malware_quarantined` events:
  - `filename` — original filename of the uploaded file (required).
  - `quarantine_id` — identifier that can be correlated with the on‑disk quarantine entry (required).
  - `signature` — malware signature reported by ClamAV (optional).
  - `detail` — human‑readable description of the detection (optional).
  - `detected_by` — string indicating which scanner reported the hit (optional, for example `"clamav"`).

Example JSON envelope sent from filescan:

```json
{
  "type": "malware_quarantined",
  "occurred_at": "2025-01-01T12:34:56Z",
  "source": "filescan",
  "payload": {
    "filename": "eicar.com",
    "quarantine_id": "0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c",
    "signature": "Eicar-Test-Signature",
    "detail": "Malware detected by ClamAV.",
    "detected_by": "clamav"
  }
}
```

The ingest view uses the serializer schema for documentation/OpenAPI, but still performs its own runtime validation (for example, checking types, `occurred_at` parseability, and required payload fields) and will return HTTP 400 for malformed envelopes.

On accepted `malware_quarantined` events, the backend currently dispatches a **security alert email**.

<sub><a href="#top">Back to top.</a></sub>

### Configuration

The following keys are needed for configuration:

- `INTERNAL_EVENTS_TOKEN` — shared secret used to authenticate calls (compared against the `X-Internal-Token` header).
- `SECURITY_ALERT_RECIPIENTS` — iterable of email addresses that should receive malware‑quarantined alerts.
- `SECURITY_ALERT_FROM_EMAIL` — from‑address used when sending the alert.

If `SECURITY_ALERT_RECIPIENTS` or `SECURITY_ALERT_FROM_EMAIL` is missing, the event is rejected with HTTP 500 and an error is logged. When configured correctly, the backend builds a short plaintext summary (filename, quarantine ID, signature, detector, timestamp) and sends it via `send_mail`, then returns HTTP 204.

<sub><a href="#top">Back to top.</a></sub>

## Integration commands

All commands below assume you run them from the **project root** and that `.env.dev` exists and is up to date.

### Build images

Build backend and filescan (run after changing their code or dependencies). For a clean rebuild of both:

```bash
docker compose --env-file .env.dev \
  -f docker-compose.yml -f docker-compose.filescan_integration.yml \
  build --no-cache backend filescan
```

<sub><a href="#top">Back to top.</a></sub>

### Start services

Start the db, backend, and filescan in the background (initial start, or after a full rebuild):

```bash
docker compose --env-file .env.dev \
  -f docker-compose.yml -f docker-compose.filescan_integration.yml \
  up -d db backend filescan
```

After rebuilding only the backend image (step 1), run `up -d backend` so the running container is recreated from the new image.

<sub><a href="#top">Back to top.</a></sub>

### Serializer and upload tests

Run inside the **running** backend container. These tests do not call the real filescan service (scan is mocked). Warnings are suppressed for this run.

```bash
docker compose --env-file .env.dev \
  -f docker-compose.yml -f docker-compose.filescan_integration.yml \
  exec backend \
  uv run pytest -W ignore content/tests/image/test_image_serializer.py content/tests/image/test_image_upload.py
```

<sub><a href="#top">Back to top.</a></sub>

### Backend to filescan integration tests

Run inside the **running** backend container. These tests make real HTTP calls to the filescan service (`/scan` on port 9101). Warnings are suppressed for this run.

```bash
docker compose --env-file .env.dev \
  -f docker-compose.yml -f docker-compose.filescan_integration.yml \
  exec backend \
  uv run pytest -W ignore content/tests/filescan/test_image_filescan_integration.py -v
```

**Note:** Both test commands use `-W ignore` so that deprecation and other warnings (e.g. from factory_boy, pagination) do not clutter the output. Remove `-W ignore` if you need to see warnings.

<sub><a href="#top">Back to top.</a></sub>

## HTTP client

### Where the client lives

The backend integrates with the filescan service via a single package:

- `backend/core/filescan/`
  - `filescan_client.py` — HTTP client: `scan_file(...)`, `FilescanError`
  - `scan_helpers.py` — view-layer helper: `scan_uploads_and_rewind(uploads)` (scans, rewinds on success, returns a 400 `Response` on malware or scan error)

This package is the only place where the backend knows how to call the `/scan` endpoint. Public API (re-exported from `core.filescan`):

- `scan_file(upload: UploadedFile) -> dict[str, Any]`
- `FilescanError(Exception)`
- `scan_uploads_and_rewind(uploads: list) -> Response | None` — returns `None` if all scans pass (and rewinds uploads); returns a DRF `Response` with 400 on malware or `FilescanError`

<sub><a href="#top">Back to top.</a></sub>

### scan_file

- Resolves the scan URL as follows:
  - If `FILESCAN_URL` is set, it is used directly.
  - Else if `FILESCAN_BASE_URL` is set, `/scan` is appended.
  - Else it defaults to `http://filescan:9101/scan` (the docker-compose service name + port).

The filescan service listens on the port given by **`FILESCAN_PORT`** (default `9101`). That variable is used in the project's `docker-compose.yml` for port mapping and healthcheck; see [README.md](./README.md) for details.

- Sends the uploaded file to the filescan service using `httpx.post(...)` with a multipart field named `file`.
- Returns **exactly** the JSON body returned by filescan when the status code is 200.
- Raises `FilescanError` if the request fails (network/timeout) or if the service returns a non-200 status code.

<sub><a href="#top">Back to top.</a></sub>

### Intended use

**Recommended for views:** Use the helper so the backend doesn't duplicate scan/error handling:

- Example:
  ```python
  from core.filescan import scan_uploads_and_rewind

  ...

  def create(self, request: Request, *args: Any, **kwargs: Any) -> Response:
      files = request.FILES.getlist("file_object")
      if err := scan_uploads_and_rewind(files or []):
          return err
  ```

**Lower-level usage:** For custom flows, use `scan_file` and handle the result yourself:

1. **Call `scan_file` as early as possible** in the request lifecycle, before any processing or saving.
2. **Interpret only the high-level signal**:
   - If `result["malware_detected"] is True`: block the upload and return a generic "rejected by security scan" error.
   - If `FilescanError` is raised: treat as “scan unavailable” and return a generic “could not be scanned” error.
   - Otherwise: rewind the upload(s) if needed and proceed with normal validation and handling.

Detailed metadata from filescan (`detail`, `signature`, `source`) is meant for logging, metrics, and notification workflows on the filescan side (or a dedicated incident/notification pipeline), not for user-facing messages from the backend.

<sub><a href="#top">Back to top.</a></sub>

### Current use

At present the backend uses this package in the image upload views:

- `backend/content/views.py`
  - `ImageViewSet.create` (`/v1/content/images`)
  - `ImageIconViewSet.create` (`/v1/content/image_icon`)

Those views import `scan_uploads_and_rewind` from `core.filescan`, pass the request’s file(s) to it, and if it returns a `Response` they return it immediately; otherwise they proceed to the serializer and save.

Any other backend code that needs to scan uploads should use this package: `from core.filescan import scan_uploads_and_rewind` for the usual view flow, or `from core.filescan import scan_file` (and `FilescanError`) for custom logic—rather than calling `/scan` directly or importing from `services/filescan/*`.

<sub><a href="#top">Back to top.</a></sub>

## Endpoints

### OpenAPI documentation

FastAPI exposes an interactive OpenAPI UI for this service at `GET /docs`, showing the `/health` and `/scan` endpoints, their request/response schemas, and example payloads. This documentation can be previewed at:

```bash
http://localhost:9101/docs
```

### Health check

`GET /health` → `{"status": "ok"}` if the service is up.

### Malware scan

`POST /scan` with `multipart/form-data` and a `file` field. The service runs both ClamAV (malware) and a CSAM scan (currently a stub; intended for an approved hash/API service e.g. PhotoDNA). If any scanner reports a hit, the response has `malware_detected: true` and an optional `source` field (`"clamav"` or `"csam"`).

On success, returns HTTP 200 with a body like:

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

<sub><a href="#top">Back to top.</a></sub>

## Additional scans to consider

Over time, this service can evolve into a more general **content safety pipeline**, where multiple scanners run over the same upload and contribute to a single safety decision.

The service is designed to eventually include CSAM detection through a separate scanner implemented in `scanners/csam.py` and wired into the `/scan` endpoint alongside ClamAV. This service is currently stubbed so that the architecture of having multiple concurrent scanners is set. If a CSAM scanner is included, then it likely would use Microsoft's **PhotoDNA Cloud Service** or Google's **CSAI Match** via `CSAM_API_URL` and `CSAM_API_KEY`.

In addition to malware and potentially expanding the CSAM hash‑matching, candidates include:

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

<sub><a href="#top">Back to top.</a></sub>

## To Do

- **HTTP method hardening tests for filescan port (`9101`)**
  - Add explicit tests that probe `http://localhost:9101` using non-supported HTTP methods (for example `PUT`, `PATCH`, `DELETE`, `OPTIONS`, `TRACE`) against `/scan` and `/health`, and assert only intended methods are accepted while others return sensible error codes (for example `405 Method Not Allowed`).

- **Quarantine integration test cleanup**
  - The test in `tests_integration/test_scan_quarantine_integration.py` should confirm the quarantined file exists on disk (e.g. in the host-visible quarantine folder) and delete it when the test finishes. Currently the test can leave a file in the quarantine folder; revisit and fix so the test reliably asserts and cleans up.

- **System-level logging and observability**
  - Implemented: INFO-level logging for scan requests (filename, size, content_type), scan responses (status, malware_detected, detail, source), and WARNING/ERROR for 400/503.

  - No log contents are logged elsewhere. Logs go to `stderr` (also visible in Docker filescan container logs).

- **OpenAPI / API documentation**
  - FastAPI provides basic OpenAPI documentation by default. When the `filescan` container is built and running, this documentation can be previewed at

  ```bash
  http://localhost:9101/docs
  ```

  - Need to check if the project-wide OpenAPI configuration integrates this filescan doc.

- **Quarantine volume for violating files**
  - Establish a dedicated, access-controlled quarantine storage location (volume or bucket) for files where malware is detected.
  - This service uses the `FILESCAN_QUARANTINE_DIR` environment variable to determine the on-disk quarantine directory (default `/var/filescan/quarantine`) and, when `malware_detected` is `true`, writes the uploaded bytes there under a generated `quarantine_id`.
  - The `/scan` response for detected files includes `quarantine_id` (and `quarantine_available: true`) so that operators can correlate API responses with quarantined files, while the exact filesystem path is only recorded in logs.
  - Need to revisit this volume mapping when we deploy. Best solution would map to a hardened, secured storage place that can safely store malware/other quarantined files.

- **General content moderation**
  - Decide if we want to implement some type of general content moderation scanning (ie "adult content", images of violence, etc.).

- **Notification and alerting**
  - Design and implement a notification pipeline (e.g. message queue, webhook, or email integration) to alert appropriate operators or downstream systems when malware or CSAM is detected.
  - As a first step, the service exposes a `notify_malware_quarantined(event: dict)` hook that currently logs a structured \"malware quarantined\" event; this can be extended later to send real notifications without changing the core `/scan` logic.

- **CSAM service integration and configuration**
  - Select and integrate an approved CSAM detection service (hash-based or API-based), wire it into `scanners/csam.py`, and add environment-driven configuration (endpoints, credentials, timeouts) plus clear operational documentation.

- **Abuse prevention, access control, and limits**
  - Define authentication/authorization for access to the `/scan` endpoint.

- **Compliance, retention, and reporting workflows**
  - Document and implement policies around data retention (including how long quarantined files and logs are kept), legal reporting obligations for CSAM, and operator playbooks for handling detections in different jurisdictions.

<sub><a href="#top">Back to top.</a></sub>
