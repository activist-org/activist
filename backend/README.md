# backend

The backend for activist, which is separated into various apps based on entities (users, organizations, groups, events, etc) and content. Please note that the [backend schema on Figma](https://www.figma.com/design/I9McFfaLu1RiiWp5IP3YjE/activist_public_designs?node-id=5377-33014&t=HfZxq0Gwnhqqya8o-1) is the source of truth for the models.

## Security events ingestion

- **Ingest endpoint:** Security events from internal services (such as the filescan service) are ingested via `POST /internal/security-events`, implemented by `SecurityEventIngestView` in `core/internal_events.py`.
- **Schema and validation:** The expected JSON security event envelope is described by `SecurityEventEnvelopeSerializer` in `core/serializers.py` for schema/OpenAPI purposes, but the view also performs additional runtime validation (for example, basic type checks and timestamp parsing) before dispatching alerts.
