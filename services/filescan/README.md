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

## ClamAV scanner

### Process

The service runs a `clamd` daemon **inside the same container** and talks to it over a Unix socket.

The Python application uses the [`clamav-client`](https://pypi.org/project/clamav-client/) package ([`clamav_client`](https://github.com/artefactual-labs/clamav-client) on GitHub) to connect to `clamd` via `INSTREAM` scans; the engine itself is the Alpine `clamav` package in the image.

On startup, the container updates the ClamAV malware signature database before accepting requests. You can adjust this behavior by editing the `freshclam 2>/dev/null || true` line in [`entrypoint.sh`](./entrypoint.sh).

Uploaded files are read into memory and passed to ClamAV; the result is returned as JSON indicating whether malware was detected and, if so, which signature matched.

Scanners are implemented as async functions that run their work in background threads via the FastAPI event loop so that multiple `/scan` requests can be processed concurrently.

Within the wider project, this service uses a **9100-series port** (`9101` by default). It is suggested that all services in the project—including this one—use ports in the 9100 range, so as to avoid port collisions with each other and with other software in the future.

### Alternatives

This service currently uses **ClamAV** for malware scanning. Other options include: **VirusTotal**, **Cloudmersive**, **Opswat**, **Scanii**, and **MultiAV**. For offloading scan work to background tasks, **Celery** can be used as a task runner to run scans asynchronously.

<sub><a href="#top">Back to top.</a></sub>

## Integration with activist backend

When malware is detected and quarantined, this service also emits a structured security event to the backend over HTTP:

- Events are sent to the backend’s internal ingestion endpoint at `POST /internal/security-events`.
- Access to this endpoint is controlled via a shared secret header (`X-Internal-Token`) and is intended only for trusted internal services, not public clients.
- The backend then translates accepted events into operator alerts (e.g. console emails in development, real notification channels in staging/production, depending on configuration).

The JSON envelope for these events is described by `SecurityEventEnvelopeSerializer` in the backend (see `backend/core/serializers.py`), but the ingest view in `backend/core/internal_events.py` also performs additional runtime validation before dispatching alerts. For a concrete example payload, and details of the email alert behaviour, see **[INTEGRATION_NOTES.md](./INTEGRATION_NOTES.md)**.

## TL;DR

- **Quarantine storage:** Add the directory in the Dockerfile (no `VOLUME`); in local development, mount a host directory (bind mount) on that path via `docker-compose.yml` (e.g. `./quarantine:/var/quarantine`) so you can inspect quarantined files easily and they persist across restarts.
- **Flow:** Filescan quarantines on detection and owns logging + notifications (in filescan or a separate service under `services/`); backend never saves the file and, on a positive scan response, deletes its copy and stops processing.
- **Local dev workflow:** Use the commands below (from the repo root, with `.env.dev` present) to build images, run the stack, and exercise backend ↔ filescan integration tests.

**1. Where to define the quarantine path**

- **Dockerfile:** Create the directory (e.g. `RUN mkdir -p /var/quarantine` and set ownership). Do **not** add a `VOLUME` instruction; it doesn't give you the persistence you want.
- **docker-compose.yml (local dev):** Mount a host directory under the repo (e.g. `./quarantine:/var/quarantine`) so quarantine data survives restarts and can be inspected on the host. The Dockerfile only prepares the path; persistence comes from the compose bind mount (or whatever orchestrator you use).

**2. Does the bind mount need to be in the Dockerfile?**

- **No.** You don't define the volume/mount in the Dockerfile. You do need the directory (and permissions) there. The actual quarantine persistence comes from how you run the container (e.g. bind mount in `docker-compose.yml`).

**3. Persistence and restarts**

- A directory created only in the Dockerfile does **not** persist across "compose down/up" or container replacement. A bind mount in docker-compose (or equivalent) gives you persistence for local development by mapping the container path to a host directory (e.g. `./quarantine`). In other environments you can use a named volume or storage class instead, as long as `/var/quarantine` (or your chosen path) is mounted to persistent storage.

**4. Who quarantines and overall flow**

- You chose **filescan** as the place that quarantines: when malware is detected, filescan writes the bytes it scanned to its quarantine and notifies admin/designated recipients. The backend never saves the file to normal storage; on a positive result it deletes its copy and logs. So: filescan "deals with" the bad file (quarantine + alerts); backend wipes its artifact and stops processing.

**5. Notifications and logging (in filescan + backend)**

- **Logging** is enabled in the filescan service: INFO for each scan request (filename, size, content_type) and response (status, malware_detected, detail, source), and WARNING/ERROR for 400/503. No file contents are logged; output goes to stderr (e.g. Docker container logs). In production, log output should be handled (e.g. aggregation, rotation, sampling, or raising the log level) so that high request volume does not produce an unbounded stream of entries.
- **Logging and alerting** for detections: when malware (or CSAM) is detected, filescan should **log** the event in a structured way (timestamp, filename, signature/source, quarantine reference; no file contents or raw uploads) and perform any **alerting** (e.g. metrics, internal dashboards) as part of the same flow.
- **Notifications** should be triggered when a detection occurs (so that designated recipients—site/admin operators and any other designated users, e.g. security contacts—can act on the incident). When filescan gets a positive malware result, it POSTs a structured security event (including available metadata from the detection, such as filename, signature, detector, and quarantine identifier) to the backend’s internal ingestion endpoint (`POST /internal/security-events`). The backend is responsible for turning this event into concrete notifications (for example, via its existing SMTP/email configuration to send operator alerts), and can later fan this out to additional channels (webhooks, queues, dashboards) as needed.

**6. Backend security event ingestion (`/internal/security-events`)**

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

On accepted `malware_quarantined` events, the backend currently dispatches a **security alert email**:

- **Config keys:**
  - `INTERNAL_EVENTS_TOKEN` — shared secret used to authenticate calls (compared against the `X-Internal-Token` header).
  - `SECURITY_ALERT_RECIPIENTS` — iterable of email addresses that should receive malware‑quarantined alerts.
  - `SECURITY_ALERT_FROM_EMAIL` — from‑address used when sending the alert.
- Behaviour:
  - If `SECURITY_ALERT_RECIPIENTS` or `SECURITY_ALERT_FROM_EMAIL` is missing, the event is rejected with HTTP 500 and an error is logged.
  - When configured correctly, the backend builds a short plaintext summary (filename, quarantine ID, signature, detector, timestamp) and sends it via `send_mail`, then returns HTTP 204.

## Integration tasks: build, run, test

All commands below assume you run them from the **project root** and that `.env.dev` exists and is up to date.

### 1. Build images

Build backend and filescan (run after changing their code or dependencies). For a clean rebuild of both:

```bash
docker compose --env-file .env.dev \
  -f docker-compose.yml -f docker-compose.filescan_integration.yml \
  build --no-cache backend filescan
```

### 2. Start services

Start db, backend, and filescan in the background (initial start, or after a full rebuild):

```bash
docker compose --env-file .env.dev \
  -f docker-compose.yml -f docker-compose.filescan_integration.yml \
  up -d db backend filescan
```

After rebuilding only the backend image (step 1), run `up -d backend` so the running container is recreated from the new image.

### 3. Serializer + upload tests (mocked filescan)

Run inside the **running** backend container. These tests do not call the real filescan service (scan is mocked). Warnings are suppressed for this run.

```bash
docker compose --env-file .env.dev \
  -f docker-compose.yml -f docker-compose.filescan_integration.yml \
  exec backend \
  uv run pytest -W ignore content/tests/image/test_image_serializer.py content/tests/image/test_image_upload.py
```

### 4. Backend ↔ filescan integration tests

Run inside the **running** backend container. These tests make real HTTP calls to the filescan service (`/scan` on port 9101). Warnings are suppressed for this run.

```bash
docker compose --env-file .env.dev \
  -f docker-compose.yml -f docker-compose.filescan_integration.yml \
  exec backend \
  uv run pytest -W ignore content/tests/filescan/test_image_filescan_integration.py -v
```

**Note:** Both test commands use `-W ignore` so that deprecation and other warnings (e.g. from factory_boy, pagination) do not clutter the output. Remove `-W ignore` if you need to see warnings.

## Backend ↔ filescan HTTP client

### Where the client lives

The backend integrates with the filescan service via a single package:

- `backend/core/filescan/`
  - `filescan_client.py` — HTTP client: `scan_file(...)`, `FilescanError`
  - `scan_helpers.py` — view-layer helper: `scan_uploads_and_rewind(uploads)` (scans, rewinds on success, returns a 400 `Response` on malware or scan error)

This package is the only place where the backend knows how to call the `/scan` endpoint. Public API (re-exported from `core.filescan`):

- `scan_file(upload: UploadedFile) -> dict[str, Any]`
- `FilescanError(Exception)`
- `scan_uploads_and_rewind(uploads: list) -> Response | None` — returns `None` if all scans pass (and rewinds uploads); returns a DRF `Response` with 400 on malware or `FilescanError`

`scan_file`:

- Resolves the scan URL as follows:
  - If `FILESCAN_URL` is set, it is used directly.
  - Else if `FILESCAN_BASE_URL` is set, `/scan` is appended.
  - Else it defaults to `http://filescan:9101/scan` (the docker-compose service name + port).

  The filescan service listens on the port given by **`FILESCAN_PORT`** (default `9101`). That variable is used in the project's `docker-compose.yml` for port mapping and healthcheck; see [README.md](./README.md) for details.
- Sends the uploaded file to the filescan service using `httpx.post(...)` with a multipart field named `file`.
- Returns **exactly** the JSON body returned by filescan when the status code is 200.
- Raises `FilescanError` if the request fails (network/timeout) or if the service returns a non-200 status code.

### How it is intended to be used

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

### Where it is currently used

At present the backend uses this package in the image upload views:

- `backend/content/views.py`
  - `ImageViewSet.create` (`/v1/content/images`)
  - `ImageIconViewSet.create` (`/v1/content/image_icon`)

Those views import `scan_uploads_and_rewind` from `core.filescan`, pass the request’s file(s) to it, and if it returns a `Response` they return it immediately; otherwise they proceed to the serializer and save.

Any other backend code that needs to scan uploads should use this package: `from core.filescan import scan_uploads_and_rewind` for the usual view flow, or `from core.filescan import scan_file` (and `FilescanError`) for custom logic—rather than calling `/scan` directly or importing from `services/filescan/*`.

## Recent integration summary

- Runtime validation in `SecurityEventIngestView` is intentionally strict: unsupported event types, invalid/missing `occurred_at`, and missing required payload fields are rejected with HTTP 400; security alert configuration/send failures return HTTP 500.
- Backend filescan integration tests and endpoint behavior are stable with the current flow: files are scanned before processing, malware hits are rejected, and scan transport failures are surfaced as a generic "could not be scanned" response.
- CI throttling test failures were addressed by making test throttling setup deterministic at test scope (explicit throttle class/rate setup with cleanup), without changing the intended backend<->filescan runtime behavior.

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

## CSAM implementation and broader content safety pipeline

The service is designed to support CSAM detection through a separate scanner implemented in `scanners/csam.py` and wired into the `/scan` endpoint alongside ClamAV.

At present, the CSAM path is stubbed (it always reports clean) and is intended to be wired to an approved hash‑based or API‑based CSAM detection service (for example, a PhotoDNA‑style cloud service or a vetted hash‑matching daemon provided by a hotline or clearinghouse).

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
  - Select and integrate an approved CSAM detection service (hash-based or API-based), wire it into `scanners/csam.py`, and add environment-driven configuration (endpoints, credentials, timeouts) plus clear operational documentation.

- **Abuse prevention, access control, and limits**
  - Define authentication/authorization for access to the `/scan` endpoint.

- **Compliance, retention, and reporting workflows**
  - Document and implement policies around data retention (including how long quarantined files and logs are kept), legal reporting obligations for CSAM, and operator playbooks for handling detections in different jurisdictions.

## CSAM Notes

The service has a saved, but non-functional CSAM scanner in `scanners/csam.py` that is wired into the `/scan` endpoint:

- **Interfaces**
  - `scan_with_csam(file_bytes: bytes) -> tuple[bool, str, str | None]` (async)
  - `_scan_with_csam_sync(file_bytes: bytes) -> tuple[bool, str, str | None]` (sync)
- **Tuple semantics**
  - `detected` (`bool`): whether CSAM was detected.
  - `detail` (`str`): human‑readable summary (e.g. `"CSAM detected."`, `"No CSAM detected."`).
  - `signature` (`str | None`): identifier from the CSAM service (e.g. hash or signature name), else `None`.
  - `_scan_with_csam_sync` is expected to raise `RuntimeError` when the CSAM service is unavailable.

The FastAPI endpoint already:

- Runs `scan_with_clamav` and `scan_with_csam` concurrently.
- Returns HTTP `503` when a `RuntimeError` escapes from either scanner.
- Prefers the first positive result (ClamAV then CSAM) and includes an optional `"source"` field (`"clamav"` or `"csam"`).

Implementation work is therefore localized to replacing the stub inside `_scan_with_csam_sync` and providing configuration.

## 2. Hash‑based CSAM detection

The most directly applicable category is **perceptual hash‑matching** against vetted CSAM databases, e.g. Microsoft’s **PhotoDNA Cloud Service** or Google's **Google CSAI Match**.

**Key characteristics:**

- You send images and the service derives a **perceptual hash** and compares it to a database of known CSAM.
- The API returns match / no‑match plus limited metadata; customer content is not stored and hashes are non‑reversible.
- Access is restricted to **qualified online service providers** and involves vetting and legal/operational review.
- Designed explicitly for CSAM workflows alongside organizations such as NCMEC.

**How it maps to `csam.py`:**

- `_scan_with_csam_sync(file_bytes)` would:
  - Read configuration from environment (e.g. `CSAM_API_URL`, `CSAM_API_KEY`, timeouts).
  - Send `file_bytes` to the service's endpoint according to their documentation.
  - Map responses to the existing tuple:
    - No match → `(False, "No CSAM detected.", None)`.
    - Positive match → `(True, "CSAM detected.", "<PhotoDNA-match-id>")` or similar.
  - Interpret network failures, timeouts, or explicit service errors as **"service unavailable"** and raise `RuntimeError("CSAM scanner unavailable")`.
- The async wrapper `scan_with_csam` remains unchanged, continuing to offload work via `asyncio.to_thread`.
- The positives of this are that it's hash-based so we never store or manage raw CSAM datasets.
- We should note that this could create operational and legal obligations (e.g. reporting flows, audits).

## 3. Implementation approach for this codebase

Given the current design (CSAM scanner as a separate async component with a well‑defined tuple API), a practical, future‑proof plan is:

1. **Keep the public interface stable**
   - Continue to expose `scan_with_csam` and `_scan_with_csam_sync` with the existing tuple contract and `RuntimeError` semantics.
   - Do not change the FastAPI endpoint or response shape; CSAM remains one of multiple scanners.

2. **Introduce a small internal “CSAM client” abstraction**
   - Implement a thin client that:
     - Reads configuration from environment (endpoint, credentials, timeouts, optional region/customer ID).
     - Handles HTTP or local‑daemon communication.
     - Normalizes responses into a simple “match/no‑match + identifier” structure.
   - `_scan_with_csam_sync` should delegate to this client and convert its output to `(detected, detail, signature)`.

3. **Error handling and availability**
   - Treat network errors, timeouts, and provider 5xx as “scanner unavailable”; raise `RuntimeError` so the `/scan` endpoint can return HTTP `503`.
   - Consider adding basic retry/backoff or circuit‑breaker behaviour if the upstream service is flaky.

4. **Configuration and secrets**
   - Use environment variables (and, where appropriate, secret management systems) for:
     - API keys / tokens.
     - Service URLs.
     - Timeouts and any optional flags.
   - Do not log raw request payloads or image bytes; log only high‑level events and error summaries.

5. **Testing strategy**
   - **Unit tests**:
     - Mock the CSAM client or HTTP layer to simulate:
       - Clean result → `(False, "No CSAM detected.", None)`.
       - Positive result → `(True, "CSAM detected.", "<signature>")`.
       - Service unavailable → `_scan_with_csam_sync` raising `RuntimeError`.
     - Optionally cover malformed responses and ensure they are handled safely (e.g. treated as unavailable or as “no decision”).
   - **Endpoint tests**:
     - Continue to use `monkeypatch` in `tests/test_scan_endpoint.py` to patch `main.scan_with_csam` and assert:
       - Positive CSAM → `malware_detected: true`, appropriate `detail`, `signature`, and `source: "csam"`.
       - Scanner failure → HTTP `503` with a clear error message, if desired.
   - **Integration tests** (optional and heavily controlled):
     - If the chosen provider offers a test environment and safe test vectors, add opt‑in integration tests that:
       - Are skipped when CSAM credentials/config are absent.
       - Use provider‑approved benign test samples or hashes, never real CSAM.
