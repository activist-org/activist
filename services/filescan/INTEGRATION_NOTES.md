# Integration notes

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
