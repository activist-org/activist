// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * E2E coverage report. The implementation lives in test-e2e/e2e-coverage/;
 * this file stays as the documented command path.
 *
 * Run from `frontend/`: node test-e2e/scripts/e2e-coverage.mjs [--verbose|--routes|--uncovered|--json] [--out]
 */

import { main } from "../e2e-coverage/run.mjs";

main();
