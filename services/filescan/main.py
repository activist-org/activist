# SPDX-License-Identifier: AGPL-3.0-or-later

import os

import pyclamd
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse


app = FastAPI(
    title="File Scan Service",
    version="0.1.0",
)

# Socket path must match clamd.conf (and entrypoint.sh). Default matches Alpine.
CLAMAV_SOCKET = os.environ.get("CLAMAV_SOCKET_PATH", "/run/clamav/clamd.sock")


def get_clamd_client() -> pyclamd.ClamdUnixSocket:
    """
    Return a connected ClamAV client.

    Connect to a local ClamAV daemon via its Unix socket.
    Raises RuntimeError if no ClamAV daemon is reachable.
    """
    client = pyclamd.ClamdUnixSocket(CLAMAV_SOCKET)

    try:
        if not client.ping():
            raise RuntimeError("ClamAV daemon is not responding to ping()")
    except Exception as exc:  # noqa: BLE001
        raise RuntimeError(f"Unable to connect to ClamAV daemon: {exc}") from exc

    return client

# Build: docker build -t filescan-service:0.1.0 .
# Run: docker run --rm -p 9101:9101 filescan-service:0.1.0

# Quick tests after Docker build/run:
# GET/healthcheck: curl http://localhost:9101/health
# POST/scan:
# Replace "@/Users/imac/Desktop/actTemp/testImages/testImage_01.jpg" with your own file path.
# curl -X POST \ -F "file=@/Users/imac/Desktop/actTemp/testImages/testImage_01.jpg" \ http://localhost:9101/scan  

# FIXME: git commit --no-verify -m "..."

# FIXME: git commit --no-verify -m "..."

# TODO: Add logging to the service.
# TODO: Do we even need named endpoints?
# TODO: How to best handle testing?
#       - Do we really want a test file with malware in the system somewhere?

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

    # Read the entire file into memory for now.
    file_bytes = await file.read()

    # TODO: Implement file scanning logic here.
    #       - Should use the async capabilities of FastAPI so that we can add multiple scans in parallel.
    # TODO: For now, assume two attack vectors:
    #       - Malware file upload from registered user.
    #       - Malware file upload from direct use of the API.
    # TODO: Detected malware should trigger a security event:
    #       - Isolate the file for forensic analysis.
    #       - Capture and log as much information as possible about the sender
    #         - Username
    #         - IP Address
    #         - User Agent
    #         - etc.
    #       - Send a security alert to the user/UI.
    #       - Send a security alert to the admin / security team.
    # TODO: Add additional scans (CSAM, etc.).

    try:
        client = get_clamd_client()
    except RuntimeError as exc:
        return JSONResponse(
            content={"detail": str(exc)},
            status_code=503,
        )

    # scan_stream returns either None (no virus) or a dict like
    # {"stream": ("FOUND", "Eicar-Test-Signature")}
    result = client.scan_stream(file_bytes)

    if not result:
        return JSONResponse(
            content={
                "filename": file.filename,
                "malware_detected": False,
                "detail": "No malware detected by ClamAV.",
            },
            status_code=200,
        )

    status, signature = result["stream"]

    # TODO: Needs a volume in docker-compose.yml to store the quarantined files.

    return JSONResponse(
        content={
            "filename": file.filename,
            "malware_detected": status == "FOUND",
            "signature": signature,
            "detail": "Malware detected by ClamAV."
            if status == "FOUND"
            else "Unexpected scan status.",
        },
        status_code=200,
    )
