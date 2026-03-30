## CSAM Detection – Implementation Notes

Real CSAM (Child Sexual Abuse Material) detection is heavily regulated. This document outlines realistic options and how they fit into the existing `csam.py` stub.

Handling, storing, or even just routing CSAM‑related materials and signals can create **significant legal exposure and mandatory reporting obligations**, which vary by jurisdiction. Any implementation work described here must be done under appropriate legal counsel and organizational policies.

## 1. Current code contract

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
