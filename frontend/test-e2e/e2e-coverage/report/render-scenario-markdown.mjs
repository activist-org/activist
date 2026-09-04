// SPDX-License-Identifier: AGPL-3.0-or-later
/** Default report: summary, categories, flows, and what is still missing. */

import { ID_PREFIXES } from "../catalog/index.mjs";
import { collectMissingCases, missWhy } from "./missing-cases.mjs";

function shortSpec(file) {
  return file.replace(/^test-e2e\/specs\//, "");
}

function caseStatusLabel(item) {
  if (item.required === false) return "⏳ deferred";
  if (item.status === "covered") return "✅";
  if (item.status === "partial") return "⚠️ skipped";
  if (item.reason === "title_miss") return "❌ title";
  return "❌ no spec";
}

function formatMatchedTests(item) {
  if (item.status === "missing") return "-";
  const titles = item.testTitles ?? [];
  if (titles.length === 0) return "-";
  const shown = titles
    .slice(0, 3)
    .map((title) => `\`${title.replace(/\|/g, "/")}\``);
  const extra = titles.length > 3 ? `, +${titles.length - 3} more` : "";
  return `${shown.join(", ")}${extra}`;
}

export function renderScenarioMarkdown(report, args) {
  const matrix = report.scenarioMatrix;
  const lines = [];
  lines.push(`# E2E scenario coverage report`);
  lines.push("");
  lines.push(
    `Generated **${report.generatedAt}** on \`${report.branch}\` (\`${report.sha}\`).`
  );
  lines.push("");
  lines.push(
    "This is a **scenario** report (behaviors we agreed to protect), not a route-hit count. The catalog lives in `frontend/test-e2e/e2e-coverage/catalog/`. A cell is covered when a current spec path matches, and a `test()` title matches when one is required."
  );
  lines.push("");
  lines.push("Regenerate from `frontend/`:");
  lines.push("");
  lines.push("```bash");
  lines.push(
    args.verbose
      ? "node test-e2e/scripts/e2e-coverage.mjs --verbose --out"
      : "node test-e2e/scripts/e2e-coverage.mjs --out"
  );
  lines.push("```");
  lines.push("");
  lines.push("## Executive summary");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("|--------|-------|");
  lines.push(`| Required scenarios | **${matrix.required}** |`);
  lines.push(`| Covered | **${matrix.covered} (${matrix.pct}%)** |`);
  lines.push(`| Partial (skipped tests only) | ${matrix.partial} |`);
  lines.push(`| Missing | ${matrix.missing} |`);
  lines.push(`| Deferred (in catalog, not counted) | ${matrix.deferred} |`);
  lines.push(
    `| Spec files | ${report.specFiles} (\`all/\` ${report.specBuckets.all}, \`desktop/\` ${report.specBuckets.desktop}, \`mobile/\` ${report.specBuckets.mobile}) |`
  );
  lines.push(
    `| \`test()\` cases | ${report.testCount}${report.skippedCount ? ` (${report.skippedCount} skip/fixme)` : ""} |`
  );
  lines.push(
    `| Testable routes covered (secondary) | ${report.coveredTestable} / ${report.testableRoutes} (${report.coveragePercentTestable}%) |`
  );
  lines.push("");
  lines.push("### Coverage by category");
  lines.push("");
  lines.push(
    "This is the same id middle part (`PERM` in `EF-PERM-01`). Use it to see which kind of test is thin, not only which page."
  );
  lines.push("");
  lines.push("| Code | Meaning | Covered | Missing | Coverage |");
  lines.push("|------|---------|--------:|--------:|---------:|");
  for (const cat of matrix.categories) {
    if (cat.required === 0) continue;
    lines.push(
      `| **${cat.code}** | ${cat.meaning} | ${cat.covered}/${cat.required} | ${cat.missing} | ${cat.pct}% |`
    );
  }
  lines.push("");
  lines.push(
    "Case ids are `PREFIX-CATEGORY-NN` (example: `EF-PERM-01` is event FAQ, permissions, first case)."
  );
  lines.push("");
  lines.push("| Prefix | Area |");
  lines.push("|--------|------|");
  for (const [code, meaning] of Object.entries(ID_PREFIXES)) {
    lines.push(`| **${code}** | ${meaning} |`);
  }
  lines.push("");
  lines.push("## Coverage by flow");
  lines.push("");
  lines.push("| ID | Flow | Covered | Partial | Missing | Coverage |");
  lines.push("|----|------|--------:|--------:|--------:|---------:|");
  for (const flow of matrix.flows) {
    lines.push(
      `| ${flow.id} | ${flow.name} | ${flow.covered}/${flow.required} | ${flow.partial} | ${flow.missing} | ${flow.pct}% |`
    );
  }
  lines.push("");

  const missing = collectMissingCases(matrix);
  lines.push(`## Missing scenarios (${missing.length})`);
  lines.push("");
  lines.push(
    "`Spec` is the path fragment the catalog looks for. `Title` is an optional `test()` name filter. **no spec file matches** means no file path contains that fragment. **spec found, title did not match** means a file exists but no test title matches."
  );
  lines.push("");
  if (missing.length === 0) {
    lines.push("_None._");
    lines.push("");
  } else {
    lines.push("| ID | Flow | Cat | Scenario | Spec | Title | Why |");
    lines.push("|----|------|-----|----------|------|-------|-----|");
    for (const { flow, item } of missing) {
      const title = item.title ? `\`${item.title}\`` : "-";
      lines.push(
        `| ${item.id} | ${flow.name} | ${item.category} | ${item.name} | \`${item.spec.join(", ")}\` | ${title} | ${missWhy(item)} |`
      );
    }
    lines.push("");
  }

  if (args.verbose) {
    lines.push("## Flow details");
    lines.push("");
    for (const flow of matrix.flows) {
      lines.push(`### ${flow.id} ${flow.name}`);
      lines.push("");
      lines.push(
        `**${flow.covered}/${flow.required}** covered (${flow.pct}%).`
      );
      lines.push("");
      lines.push("| ID | Cat | Scenario | Status | Spec | Matched test |");
      lines.push("|----|-----|----------|--------|------|--------------|");
      for (const item of flow.cases) {
        const spec =
          item.specs && item.specs.length
            ? item.specs.map(shortSpec).join(", ")
            : "-";
        lines.push(
          `| ${item.id} | ${item.category} | ${item.name} | ${caseStatusLabel(item)} | \`${spec}\` | ${formatMatchedTests(item)} |`
        );
      }
      lines.push("");
    }
  } else {
    lines.push(
      "Every row (matched spec and `test()` title): `node test-e2e/scripts/e2e-coverage.mjs --verbose`."
    );
    lines.push("");
  }

  lines.push(`## Uncovered testable routes (${report.uncoveredTestable})`);
  lines.push("");
  lines.push(
    "Secondary: URLs with no `goto` / `waitForURL` / `toHaveURL` evidence. Useful, but a hit here does not mean the scenarios above are covered."
  );
  lines.push("");
  if (report.uncoveredTestableRoutes.length === 0) {
    lines.push("_None._");
    lines.push("");
  } else {
    for (const r of report.uncoveredTestableRoutes) lines.push(`- \`${r}\``);
    lines.push("");
  }

  return lines.join("\n");
}
