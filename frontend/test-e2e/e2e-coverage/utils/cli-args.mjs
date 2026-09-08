// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Flags accepted by `node test-e2e/scripts/e2e-coverage.mjs`.
 */

export function parseArgs(argv) {
  const parsed = {
    json: false,
    routes: false,
    uncovered: false,
    verbose: false,
    out: false,
  };
  for (const a of argv) {
    if (a === "--json") parsed.json = true;
    else if (a === "--routes" || a === "--markdown" || a === "--md") {
      parsed.routes = true;
    } else if (a === "--uncovered") parsed.uncovered = true;
    else if (a === "--verbose" || a === "--full") parsed.verbose = true;
    else if (a === "--out") parsed.out = true;
  }
  return parsed;
}
