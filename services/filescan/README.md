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

## Integration with the backend

How this service fits into the wider upload flow (quarantine volume, who quarantines, backend responsibilities, and Django/DRF integration) is documented in **[INTEGRATION_NOTES.md](./INTEGRATION_NOTES.md)**.

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

## Endpoints

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
          "detail": "Malware detected by ClamAV."
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
    - `eicar.txt` — EICAR test file (industry-standard; see below).
    - `fake_image.bin` — non-image binary sent as image (tests binary handling).
  - **EICAR** (`eicar.txt`): The EICAR test file is an **industry-standard** way to verify antivirus and malware-scanning behaviour without using real malware. It is a short, harmless string that major AV engines (including ClamAV) recognise and report as “infected,” so you can confirm that your scanning pipeline is working end-to-end. It is widely used in QA and integration tests for this kind of functionality, and poses no risk to any machine on which it is present.
## CSAM implementation

The service is designed to support CSAM detection through a separate scanner implemented in `scanners/csam.py` and wired into the `/scan` endpoint alongside ClamAV.

At present, the CSAM path is stubbed (it always reports clean) and is intended to be wired to an approved hash‑based or API‑based CSAM detection service (for example, a PhotoDNA‑style cloud service or a vetted hash‑matching daemon provided by a hotline or clearinghouse).

For detailed design considerations, options, and testing strategy for CSAM integration, see:

- [`CSAM_IMPLEMENTATION_NOTES.md`](./CSAM_IMPLEMENTATION_NOTES.md)

## To Do

- **System-level logging and observability**
  - Implemented: INFO-level logging for scan requests (filename, size, content_type), scan responses (status, malware_detected, detail, source), and WARNING/ERROR for 400/503. No file contents are logged. Logs go to stderr (visible in Docker container logs).

- **Quarantine volume for violating files**
  - Establish a dedicated, access-controlled quarantine storage location (volume or bucket) for files where malware or CSAM is detected.

- **General content moderation**
  - Decide if we want to implement some type of general content moderation scanning (ie "adult content", images of violence, etc.).

- **Notification and alerting**
  - Design and implement a notification pipeline (e.g. message queue, webhook, or email integration) to alert appropriate operators or downstream systems when malware or CSAM is detected.

- **CSAM service integration and configuration**
  - Select and integrate an approved CSAM detection service (hash-based or API-based), wire it into `scanners/csam.py`, and add environment-driven configuration (endpoints, credentials, timeouts) plus clear operational documentation (see [`CSAM_IMPLEMENTATION_NOTES.md`](./CSAM_IMPLEMENTATION_NOTES.md) for detailed design notes).

- **Abuse prevention, access control, and limits**
  - Define authentication/authorization for access to the `/scan` endpoint.

- **Compliance, retention, and reporting workflows**
  - Document and implement policies around data retention (including how long quarantined files and logs are kept), legal reporting obligations for CSAM, and operator playbooks for handling detections in different jurisdictions.