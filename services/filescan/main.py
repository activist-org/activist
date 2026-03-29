# SPDX-License-Identifier: AGPL-3.0-or-later

import asyncio
import logging
import os
import uuid

from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from fastapi.responses import JSONResponse

from notification_helpers import notify_malware_quarantined
from scanners.clamav import scan_with_clamav
from scanners.csam import scan_with_csam

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

QUARANTINE_DIR = os.getenv("FILESCAN_QUARANTINE_DIR", "/var/filescan/quarantine")

app = FastAPI(
    title="File Scan Service",
    version="0.1.0",
)


@app.get("/health")
async def healthcheck() -> dict[str, str]:
    """
    Liveness/readiness probe.

    Returns 200 only when the ClamAV scanner is reachable and responding,
    so callers (including Docker healthcheck and integration tests) can rely
    on the filescan service being fully ready to handle /scan requests.
    """
    try:
        # Use a tiny, empty scan to verify that the ClamAV daemon is up.
        # scan_with_clamav will raise RuntimeError if the daemon is unavailable.
        await scan_with_clamav(b"")

    except RuntimeError as exc:
        # Surface scanner unavailability as a 503 so orchestrators know
        # the service is not yet ready.
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    return {"status": "ok"}


@app.post("/scan")
async def scan_file(
    request: Request, file: UploadFile | None = File(None)
) -> JSONResponse:
    expected_token = os.getenv("FILESCAN_INTERNAL_TOKEN")
    if expected_token:
        provided = request.headers.get("X-Filescan-Token")
        if provided != expected_token:
            logger.warning(
                "unauthorized scan request: missing or invalid X-Filescan-Token"
            )
            raise HTTPException(status_code=403, detail="Unauthorized")
    if file is None or not file.filename:
        logger.warning("scan request rejected: no file or filename")
        return JSONResponse(
            content={
                "detail": "No file was sent. Please include a file in the request."
            },
            status_code=400,
        )

    file_bytes = await file.read()
    logger.info(
        "scan request received filename=%s size=%s content_type=%s",
        file.filename,
        len(file_bytes),
        getattr(file, "content_type", None),
    )

    try:
        clamav_result, csam_result = await asyncio.gather(
            scan_with_clamav(file_bytes),
            scan_with_csam(file_bytes),
            # Add other scanners here
        )
    except RuntimeError as exc:
        logger.error("scan failed: %s", exc)
        return JSONResponse(
            content={"detail": str(exc)},
            status_code=503,
        )

    # Use first positive result (ClamAV then CSAM).
    malware_detected = False
    detail = ""
    signature: str | None = None
    source: str | None = None

    for (detected, d, sig), src in [(clamav_result, "clamav"), (csam_result, "csam")]:
        if detected:
            malware_detected = True
            detail = d
            signature = sig
            source = src
            break

    if not malware_detected:
        detail = clamav_result[1]  # e.g. "No malware detected by ClamAV."

    quarantine_id: str | None = None
    quarantine_path: str | None = None

    if malware_detected:
        safe_name = os.path.basename(file.filename or "") or "unnamed"
        safe_name = safe_name.replace(os.sep, "_")
        try:
            os.makedirs(QUARANTINE_DIR, exist_ok=True)
            quarantine_id = uuid.uuid4().hex
            quarantine_path = os.path.join(
                QUARANTINE_DIR,
                f"{quarantine_id}__{safe_name}",
            )
            with open(quarantine_path, "wb") as f_out:
                f_out.write(file_bytes)
        except OSError as exc:
            logger.error(
                "failed to write quarantine file filename=%s path=%s error=%s",
                file.filename,
                quarantine_path,
                exc,
            )

    content: dict[str, str | bool] = {
        "filename": file.filename,
        "malware_detected": malware_detected,
        "detail": detail,
    }
    if signature is not None:
        content["signature"] = signature
    if source is not None:
        content["source"] = source
    if malware_detected and quarantine_id is not None:
        content["quarantine_id"] = quarantine_id
        content["quarantine_available"] = True

    if malware_detected:
        logger.warning(
            "scan response status=200 malware_detected=%s detail=%s source=%s "
            "quarantine_id=%s quarantine_path=%s",
            content["malware_detected"],
            content["detail"],
            content.get("source"),
            quarantine_id,
            quarantine_path,
        )
        if quarantine_id is not None:
            event = {
                "filename": file.filename,
                "signature": signature,
                "source": source,
                "quarantine_id": quarantine_id,
            }
            notify_malware_quarantined(event)
    else:
        logger.info(
            "scan response status=200 malware_detected=%s detail=%s source=%s",
            content["malware_detected"],
            content["detail"],
            content.get("source"),
        )

    return JSONResponse(content=content, status_code=200)
