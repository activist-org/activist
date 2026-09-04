# E2E coverage

This folder scores the E2E suite without starting a browser. Run it from `frontend/`:

```bash
yarn test:e2e:coverage              # compact scenario report
yarn test:e2e:coverage --uncovered  # every gap and the spec path it expects
yarn test:e2e:coverage:gate         # Playwright check that coverage stays at 90%
```

`scripts/e2e-coverage.mjs` is a thin wrapper around `run.mjs`.

## Folder map

| Folder     | What it does                                                                               |
| ---------- | ------------------------------------------------------------------------------------------ |
| `parsers/` | One file per input type: Vue pages, spec files, URL evidence in specs/actions/page objects |
| `catalog/` | The required-behavior checklist. Add a `c(...)` row in `catalog/flows/`                    |
| `scoring/` | Marks each catalog row covered, partial, or missing                                        |
| `report/`  | Turns the scores into markdown, JSON, or a terminal table                                  |
| `utils/`   | Shared paths, file walking, CLI flags                                                      |

## Adding a scenario

1. Open the matching file in `catalog/flows/` (for example `events.mjs`).
2. Add a `c("EF-PERM-02", "PERM", "...", "event-faq-permissions")` row.
3. Run `yarn test:e2e:coverage` and search for the id.

See FRONTEND_TESTING.md, Checking E2E coverage, for the id legend.
