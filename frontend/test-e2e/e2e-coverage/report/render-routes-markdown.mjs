// SPDX-License-Identifier: AGPL-3.0-or-later
/** `--routes`: the original URL table, kept for route-only reviews. */

export function renderRoutesMarkdown(report, args) {
  const lines = [];
  if (!args.uncovered) {
    lines.push(`## E2E Route Coverage\n`);
    lines.push(`| Metric | Value |`);
    lines.push(`|--------|-------|`);
    lines.push(`| Spec files | ${report.specFiles} |`);
    lines.push(`| Total routes | ${report.totalRoutes} |`);
    lines.push(`| Stub/unimplemented routes | ${report.stubRoutes} |`);
    lines.push(`| Testable routes | ${report.testableRoutes} |`);
    lines.push(`| Covered | ${report.covered} |`);
    lines.push(`| Coverage (all routes) | ${report.coveragePercent}% |`);
    lines.push(
      `| **Coverage (testable only)** | **${report.coveragePercentTestable}%** |\n`
    );
    lines.push(`### ✅ Covered Routes (${report.covered})\n`);
    for (const r of report.coveredRoutes) lines.push(`- \`${r}\``);
    lines.push("");
    lines.push(
      `### ⚠️ Stub Routes — not yet implemented (${report.stubRoutes})\n`
    );
    for (const r of report.stubRoutesList) lines.push(`- \`${r}\``);
    lines.push("");
  }
  lines.push(
    `### ❌ Uncovered Testable Routes (${report.uncoveredTestable})\n`
  );
  for (const r of report.uncoveredTestableRoutes) lines.push(`- \`${r}\``);
  lines.push("");
  return lines.join("\n");
}
