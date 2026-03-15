# Integration notes

## TL;DR

- **Quarantine volume:** Add the directory in the Dockerfile (no `VOLUME`); define a **named volume** and mount it in docker-compose.yml so quarantine persists across restarts.
- **Flow:** Filescan quarantines on detection and owns logging + notifications (in filescan or a separate service under `services/`); backend never saves the file and, on a positive scan response, deletes its copy and stops processing.
- **Signal to backend:** The HTTP response from `/scan` (malware/CSAM detected) is the signal; backend treats it as "do not save, delete artifact, end processing." Optionally, backend sends a Django signal after acting for its own audit only.

---

**1. Where to define the quarantine volume**

- **Dockerfile:** Create the directory (e.g. `RUN mkdir -p /var/quarantine` and set ownership). Do **not** add a `VOLUME` instruction; it doesn't give you the persistence you want.
- **docker-compose.yml:** Define a **named volume** and mount it on that path (e.g. `filescan-quarantine:/var/quarantine`) so quarantine data survives restarts and container replacement. The Dockerfile only prepares the path; persistence comes from compose (or whoever runs the container).

**2. Does the volume need to be in the Dockerfile?**

- **No.** You don't need a volume in the Dockerfile. You do need the directory (and permissions) there. The actual quarantine volume is defined and mounted in docker-compose.yml.

**3. Persistence and restarts**

- A directory created only in the Dockerfile does **not** persist across "compose down/up" or container replacement. Only a **named volume** in docker-compose (or equivalent) gives that. So the "Dockerfile version" of the quarantine path does not persist through restarts in the way you want; the compose-defined volume does.

**4. Who quarantines and overall flow**

- You chose **filescan** as the place that quarantines: when malware is detected, filescan writes the bytes it scanned to its quarantine and notifies admin/designated recipients. The backend never saves the file to normal storage; on a positive result it deletes its copy and logs. So: filescan "deals with" the bad file (quarantine + alerts); backend wipes its artifact and stops processing.

**5. Notifications and logging (in filescan)**

- **Logging and alerting** are handled **within the filescan service**. When malware (or CSAM) is detected, filescan should **log** the event in a structured way (timestamp, filename, signature/source, quarantine reference; no file contents or raw uploads) and perform any **alerting** (e.g. metrics, internal dashboards) as part of the same flow.
- **Notifications** should be triggered when a detection occurs (so that designated recipients—site/admin operators and any other designated users, e.g. security contacts—can act on the incident). The backend does **not** have a built-in notification service for this; notifications are owned by the scan side. The notification pipeline (email, webhook, message queue, or internal dashboard) can be implemented **within filescan** or in a **separate service under the project's `services/` folder** (e.g. a dedicated notification service that filescan calls or publishes to). The channel and recipient list can be configuration-driven.

**6. Signalling the backend to stop processing**

- Filescan must **signal the backend** so the backend knows to stop processing the file. The primary signal is the **HTTP response** from the `/scan` endpoint: when filescan returns a response indicating malware (or CSAM) was detected, the backend treats that as the instruction to **not** save or process the upload, to delete its copy of the artifact, and to end file/image processing for that request.
- Optionally, the backend can use **Django signals** internally after it has acted on that response (e.g. after deleting the artifact). A custom signal (e.g. `malware_detected`) sent from the backend view with a safe payload (user id, request id, filename, scan result, timestamp) allows other parts of the Django app to react—for example, to write an audit log entry that "backend deleted an artifact following filescan detection"—without duplicating notification or scan logic. Notification and scan-side logging remain in filescan; the backend's signal is for backend-side audit and side effects only.
