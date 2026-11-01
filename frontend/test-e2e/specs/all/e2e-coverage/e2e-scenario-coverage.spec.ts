// SPDX-License-Identifier: AGPL-3.0-or-later
import { expect, test } from "@playwright/test";
import { execFileSync } from "child_process";

interface CoverageReport {
  /** Baseline from test-e2e/e2e-coverage/scoring/constants.mjs. */
  minRequiredScenarioPct: number;
  scenarioMatrix: {
    covered: number;
    required: number;
    missing: number;
    pct: number;
    categories: {
      code: string;
      required: number;
      missing: number;
      pct: number;
    }[];
    flows: { cases: { id: string; status: string }[] }[];
  };
}

let cached: CoverageReport | undefined;

/** The CLI is ESM, so it runs as a child process rather than an import. */
function loadReport(): CoverageReport {
  if (!cached) {
    const stdout = execFileSync(
      process.execPath,
      ["test-e2e/scripts/e2e-coverage.mjs", "--json"],
      { cwd: process.cwd(), encoding: "utf8" }
    );
    cached = JSON.parse(stdout) as CoverageReport;
  }
  return cached;
}

// Static analysis of specs and routes: no browser, server, or session needed.
// Run with `yarn test:e2e:coverage:gate`.
test.describe("E2E scenario coverage", { tag: "@coverage" }, () => {
  test("required scenarios stay at or above the agreed baseline", () => {
    const { minRequiredScenarioPct, scenarioMatrix } = loadReport();

    const worstCategories = scenarioMatrix.categories
      .filter((category) => category.required > 0 && category.missing > 0)
      .sort((a, b) => a.pct - b.pct)
      .slice(0, 3)
      .map((category) => `${category.code} ${category.pct}%`)
      .join(", ");

    expect(
      scenarioMatrix.pct,
      `Required scenarios: ${scenarioMatrix.covered}/${scenarioMatrix.required} covered, ${scenarioMatrix.missing} missing. Thinnest categories: ${worstCategories}. Run \`yarn test:e2e:coverage --uncovered\` to list every gap and the spec path each one expects.`
    ).toBeGreaterThanOrEqual(minRequiredScenarioPct);
  });

  test("every catalog case resolves to a known status", () => {
    const { scenarioMatrix } = loadReport();
    const cases = scenarioMatrix.flows.flatMap((flow) => flow.cases);

    expect(cases.length).toBeGreaterThan(0);
    expect(
      cases.filter(
        (item) => !["covered", "partial", "missing"].includes(item.status)
      )
    ).toEqual([]);

    const ids = cases.map((item) => item.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
  });
});
