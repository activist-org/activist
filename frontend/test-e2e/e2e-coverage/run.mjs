// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * CLI entry. Run from `frontend/`:
 *
 *   node test-e2e/scripts/e2e-coverage.mjs              compact scenario report
 *   node test-e2e/scripts/e2e-coverage.mjs --verbose     every row + matched titles
 *   node test-e2e/scripts/e2e-coverage.mjs --routes      route table only
 *   node test-e2e/scripts/e2e-coverage.mjs --uncovered   uncovered routes only
 *   node test-e2e/scripts/e2e-coverage.mjs --json        machine readable
 *   node test-e2e/scripts/e2e-coverage.mjs --out         also write to test-results/
 */

import { buildReport } from "./report/build-report.mjs";
import { emit } from "./report/emit.mjs";
import { renderRoutesMarkdown } from "./report/render-routes-markdown.mjs";
import { renderScenarioMarkdown } from "./report/render-scenario-markdown.mjs";
import { renderTerminal } from "./report/render-terminal.mjs";
import { parseArgs } from "./utils/cli-args.mjs";

export function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const report = buildReport();

  if (args.json) emit(JSON.stringify(report, null, 2), args);
  else if (args.uncovered) emit(renderTerminal(report, args), args);
  else if (args.routes) emit(renderRoutesMarkdown(report, args), args);
  else emit(renderScenarioMarkdown(report, args), args);
}
