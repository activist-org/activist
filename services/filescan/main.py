# SPDX-License-Identifier: AGPL-3.0-or-later

import asyncio

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse

from scanners import scan_with_clamav, scan_with_csam

app = FastAPI(
    title="File Scan Service",
    version="0.1.0",
)


@app.get("/health")
async def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/scan")
async def scan_file(file: UploadFile | None = File(None)) -> JSONResponse:
    if file is None or not file.filename:
        return JSONResponse(
            content={"detail": "No file was sent. Please include a file in the request."},
            status_code=400,
        )

    file_bytes = await file.read()

    try:
        clamav_result, csam_result = await asyncio.gather(
            scan_with_clamav(file_bytes),
            scan_with_csam(file_bytes),
            # Add other scanners here
        )
    except RuntimeError as exc:
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

    content: dict[str, str | bool] = {
        "filename": file.filename,
        "malware_detected": malware_detected,
        "detail": detail,
    }
    if signature is not None:
        content["signature"] = signature
    if source is not None:
        content["source"] = source

    # TODO: if 'malware_detected', send 'malware_detected' signal to backend and notify admin/designated recipients

    return JSONResponse(content=content, status_code=200)
