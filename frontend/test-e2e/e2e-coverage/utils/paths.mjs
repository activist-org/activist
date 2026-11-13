// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Directories the coverage report reads from. All paths are absolute.
 */

import { join } from "path";
import { fileURLToPath } from "url";

const HERE = fileURLToPath(new URL(".", import.meta.url));

/** The `frontend/` directory. */
export const ROOT = join(HERE, "../../..");
export const PAGES_DIR = join(ROOT, "app/pages");
export const SPECS_DIR = join(ROOT, "test-e2e/specs");

/** Scanned for page.goto / waitForURL / toHaveURL evidence. */
export const URL_EVIDENCE_DIRS = [
  SPECS_DIR,
  join(ROOT, "test-e2e/actions"),
  join(ROOT, "test-e2e/page-objects"),
];
