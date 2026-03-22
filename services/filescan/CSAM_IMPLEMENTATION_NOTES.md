## CSAM Detection – Implementation Notes

Real CSAM (Child Sexual Abuse Material) detection is heavily regulated. In practice you do not get a generic “CSAM API” like normal SaaS; instead you work with vetted hash‑matching services and formal reporting workflows. This document outlines realistic options and how they fit into the existing `csam.py` stub.

Handling, storing, or even just routing CSAM‑related materials and signals can create **significant legal exposure and mandatory reporting obligations**, which vary by jurisdiction; any implementation work described here must be done under appropriate legal counsel and organizational policies.

---

## 1. Current code contract

The service already has a CSAM scanner stubbed in `scanners/csam.py` and wired into the `/scan` endpoint:

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

---

## 2. Hash‑based CSAM detection (PhotoDNA‑style services)

### 2.1 Microsoft PhotoDNA Cloud Service

The most directly applicable category is **perceptual hash‑matching** against vetted CSAM databases, e.g. Microsoft’s **PhotoDNA Cloud Service**.

**Key characteristics:**

- You send images and the service derives a **perceptual hash** and compares it to a database of known CSAM.
- The API returns match / no‑match plus limited metadata; customer content is not stored and hashes are non‑reversible.
- Access is restricted to **qualified online service providers** and involves vetting and legal/operational review.
- Designed explicitly for CSAM workflows alongside organizations such as NCMEC.

**How it maps to `csam.py`:**

- `_scan_with_csam_sync(file_bytes)` would:
  - Read configuration from environment (e.g. `CSAM_API_URL`, `CSAM_API_KEY`, timeouts).
  - Send `file_bytes` to the PhotoDNA Cloud endpoint according to their documentation.
  - Map responses to the existing tuple:
    - No match → `(False, "No CSAM detected.", None)`.
    - Positive match → `(True, "CSAM detected.", "<PhotoDNA-match-id>")`.
  - Interpret network failures, timeouts, or explicit service errors as **“service unavailable”** and raise `RuntimeError("CSAM scanner unavailable")`.
- The async wrapper `scan_with_csam` remains unchanged, continuing to offload work via `asyncio.to_thread`.

**Pros:**

- Specifically designed and governed for CSAM detection.
- Hash‑based; we never store or manage raw CSAM datasets ourselves.

**Cons:**

- Requires application, vetting, and ongoing compliance; not suitable for casual or hobby deployments.
- Introduces operational and legal obligations (e.g. reporting flows, audits).

---

## 3. Other vetted hash‑matching / clearinghouse integrations

In some jurisdictions or partnership models, alternative or complementary sources of CSAM hash sets exist:

- National or regional CSAM hotlines / clearinghouses (e.g. NCMEC in the US, INHOPE network members).
  - For example, **NCMEC hash lists** that partners may be allowed to consume via vetted APIs or distributed hash sets.
- Commercial or consortium tools that provide:
  - Hash sets (PhotoDNA‑style or other perceptual/hash formats).
  - A local scanning service / daemon to which images can be submitted.
- Other vendor ecosystems to evaluate:
  - **Google CSAI Match** (YouTube’s perceptual hash‑matching technology exposed to qualified partners).
  - Perceptual hashing libraries such as **pHash** or Python’s **`imagehash`** (which implements pHash and related algorithms) for general duplicate/similarity detection. These are **not** CSAM datasets by themselves, but could be used as part of a broader similarity‑matching system under strict legal and policy guidance.

These generally follow similar patterns:

- You are vetted and sign agreements that govern data use, reporting, and retention.
- You either:
  - Talk to a **remote HTTP API**, or
  - Communicate with a **local process or sidecar** running the scanning engine.

**Fit with `csam.py`:**

- Architecturally identical to the PhotoDNA case:
  - `_scan_with_csam_sync` calls a configured endpoint (local or remote).
  - Results are normalized into `(detected, detail, signature)` and `RuntimeError` is used to signal unavailability.
- The rest of the system (FastAPI endpoint, tests that mock `scan_with_csam`) remains unchanged.

---

## 4. General content‑moderation APIs (not strict CSAM detection)

Cloud content‑moderation APIs (e.g. **Google Cloud Vision SafeSearch**, AWS Rekognition, Azure Content Moderator) can:

- Classify images into categories like **adult**, **racy**, **violent**, etc.
- Sometimes signal “sexual content” or “potential child nudity” at a coarse level.

However, they:

- Are **not** backed by the same vetted CSAM hash sets and legal workflows as PhotoDNA‑style systems.
- Have a different risk profile (false positives/negatives) and different compliance implications.

Therefore:

- They can be useful for **general explicit‑content filtering**, but they should not be treated as a complete CSAM compliance solution.
- If used, they should probably be implemented as a **separate classifier** rather than the primary “CSAM scanner” this service is designed to support.

**Possible integration pattern:**

- `_scan_with_csam_sync` could be extended (or a separate scanner added) to:
  - Call a SafeSearch‑type API.
  - Map “very likely explicit” and “likely minor” signals into a detection result.
- This should be clearly documented as “adult content / sexual content classification”, not equivalently strong as hash‑based CSAM detection.

---

## 5. Local or custom ML models (generally not recommended as primary CSAM detector)

In principle, one might run local ML models to classify images (e.g. detect nudity or suspicious age cues). In practice:

- Training or handling CSAM directly is legally and ethically fraught; doing this independently is generally not acceptable.
- Even for generic explicit‑content detectors, building and maintaining a high‑quality model is a significant undertaking.
- Appropriate use is typically limited to large, highly regulated organizations with dedicated safety and legal teams.

For this project, local/custom models should **not** be the primary CSAM detector. If introduced at all, they should augment, not replace, vetted hash‑matching services.

---

## 6. Implementation approach for this codebase

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

---

## 7. Summary

- The codebase is already structured for a pluggable CSAM scanner via `scanners/csam.py` and the `/scan` endpoint.
- Real‑world CSAM detection should be implemented using **vetted hash‑matching services** such as PhotoDNA or equivalent clearinghouse tooling, not ad‑hoc models or generic adult‑content classifiers.
- Implementation work is primarily:
  - Wiring `_scan_with_csam_sync` to a chosen service through a small internal client.
  - Handling configuration and error conditions cleanly.
  - Expanding tests to cover clean, positive, and unavailable scenarios while continuing to avoid any real CSAM in tests.
