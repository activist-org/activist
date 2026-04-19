<a id="top"></a>

# Backend Testing

This documentation details standards for writing pytest based backend testing files.

## Contents

- [Standards](#standards-)
- [Quickstart: Local Pytest Setup](#quickstart-local-pytest-setup)

## Standards

- All tests for backend applications should be in a `tests` sub directory
- Testing files should be named `test_ENTITY_{MODEL_SUB_CLASS}_CRUD_METHOD`, with the `MODEL_SUB_CLASS` being optional
  - Model sub classes are "bridge table" methods that are serialized into the base model
    - Ex: `flag` as a sub class of `event`
  - Model sub classes should always be singular in the base model, and should thus be singular in the test file name
  - The tests for the specific entity, model sub class and CRUD method should all be included in this file
  - Ex: `test_event_delete` (there is no `MODEL_SUB_CLASS`)
  - Ex: `test_event_flag_delete` (there is an `MODEL_SUB_CLASS`)
- If there is more than one file being used for testing entity methods, then these files should be put into a sub directory
  - Base CRUD method tests for an entity would be in the root testing directory
  - All tests for a certain model sub class  should be in a sub directory, even if there's only one file
  - Ex: Organization flag method tests should be in the `communities/organizations/tests/flag` directory
  - Ex: All CRUD method tests on organizations directly should be in the  `communities/organizations/tests` directory
- Test functions would ideally validate one HTTP response only
- Test functions should be named in the following way:
  - Start with the name of the file
  - End with the response code that is being tested if there is only one
- If there is only one API endpoint used in a testing file, it should be defined as a `SCREAMING_SNAKE_CASE` variable at the top of the file

## Quickstart: Local Pytest Setup

Use this flow to run backend pytest locally with Docker Postgres.

1. Start Docker Desktop.
2. From repo root, start the database container:

```bash
docker compose --env-file .env.dev up -d db
docker compose --env-file .env.dev ps db
```

3. Set host-side environment variables (PowerShell):

```powershell
$env:DJANGO_ENV="LOCAL_DEV"
$env:DATABASE_HOST="localhost"
$env:DATABASE_PORT="5432"
$env:DATABASE_NAME="activist"
$env:DATABASE_USER="postgres"
$env:DATABASE_PASSWORD="postgres"
```

4. Run backend tests:

```bash
pytest -v
# or run a specific subset
pytest backend/tests/test_models.py backend/tests/test_api.py -v --tb=short
```

Notes:

- Pytest uses `core.test_settings` via `backend/pyproject.toml`.
- `core.test_settings` defines explicit test DB defaults and can still be overridden by env vars.

<sub><a href="#top">Back to top.</a></sub>
