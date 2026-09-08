// SPDX-License-Identifier: AGPL-3.0-or-later
/** `--uncovered`: colored terminal summary of the scenario and route gaps. */

import { collectMissingCases, missWhy } from "./missing-cases.mjs";

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

function colorForPct(pct, greenAt, yellowAt) {
  if (pct >= greenAt) return GREEN;
  return pct >= yellowAt ? YELLOW : RED;
}

export function renderTerminal(report, args) {
  const lines = [];

  if (!args.uncovered) {
    lines.push(`\n${BOLD}E2E Route Coverage Report${RESET}`);
    lines.push("=".repeat(50));
    lines.push(`  Spec files:             ${report.specFiles}`);
    lines.push(
      `  Spec buckets:           all ${report.specBuckets.all} / desktop ${report.specBuckets.desktop} / mobile ${report.specBuckets.mobile}`
    );
    lines.push(`  test() cases:           ${report.testCount}`);
    const matrix = report.scenarioMatrix;
    const colorScenarios = colorForPct(matrix.pct, 80, 60);
    lines.push(
      `  ${BOLD}Scenario coverage:${RESET}     ${colorScenarios}${BOLD}${matrix.covered}/${matrix.required} (${matrix.pct}%)${RESET}`
    );
    lines.push(
      `  ${DIM}Scenario missing:        ${matrix.missing}  partial: ${matrix.partial}${RESET}`
    );
    lines.push(`  Total routes:           ${report.totalRoutes}`);
    lines.push(`  ${DIM}Stub/unimplemented:     ${report.stubRoutes}${RESET}`);
    lines.push(`  Testable routes:        ${report.testableRoutes}`);
    lines.push(`  ${GREEN}Covered:${RESET}                ${report.covered}`);
    const colorAll = colorForPct(report.coveragePercent, 80, 60);
    const colorTestable = colorForPct(report.coveragePercentTestable, 90, 74);
    lines.push(
      `  Coverage (all):         ${colorAll}${report.coveragePercent}%${RESET}`
    );
    lines.push(
      `  ${BOLD}Coverage (testable):${RESET}    ${colorTestable}${BOLD}${report.coveragePercentTestable}%${RESET}\n`
    );
    lines.push(`${BOLD}${GREEN}Covered Routes${RESET}`);
    lines.push("-".repeat(50));
    for (const r of report.coveredRoutes) {
      lines.push(`  ${GREEN}✓${RESET}  ${r}`);
    }
    lines.push(`\n${BOLD}${DIM}Stub Routes (unimplemented)${RESET}`);
    lines.push("-".repeat(50));
    for (const r of report.stubRoutesList) {
      lines.push(`  ${DIM}~  ${r}${RESET}`);
    }
  }

  const matrix = report.scenarioMatrix;
  const missing = collectMissingCases(matrix);
  const gateColor = matrix.pct >= report.minRequiredScenarioPct ? GREEN : RED;
  lines.push(
    `\n${BOLD}${RED}Missing Scenarios (${missing.length})${RESET}  ${gateColor}${matrix.covered}/${matrix.required} = ${matrix.pct}%, gate needs ${report.minRequiredScenarioPct}%${RESET}`
  );
  lines.push("-".repeat(50));
  if (matrix.deferred) {
    lines.push(
      `  ${DIM}${matrix.deferred} deferred row(s) not counted, see --verbose${RESET}`
    );
  }
  for (const { flow, item } of missing) {
    lines.push(
      `  ${RED}✗${RESET}  ${BOLD}${item.id}${RESET}  ${flow.name}: ${item.name}`
    );
    lines.push(
      `     ${DIM}expects \`${item.spec.join(", ")}\`, ${missWhy(item)}${RESET}`
    );
  }

  lines.push(`\n${BOLD}${RED}Uncovered Testable Routes${RESET}`);
  lines.push("-".repeat(50));
  for (const r of report.uncoveredTestableRoutes) {
    lines.push(`  ${RED}✗${RESET}  ${r}`);
  }
  lines.push("");
  lines.push(
    `${DIM}Full report with matched titles: node test-e2e/scripts/e2e-coverage.mjs --verbose${RESET}`
  );
  lines.push("");
  return lines.join("\n");
}
