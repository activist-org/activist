// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Rolls per-case results up into flow, category, and overall totals.
 * Rows marked `required: false` are excluded from the percentages.
 */

import { CATEGORIES, SCENARIO_FLOWS } from "../catalog/index.mjs";
import { evaluateCase } from "./evaluate-case.mjs";

export function categoryStats(flows) {
  const byCat = Object.fromEntries(
    Object.keys(CATEGORIES).map((code) => [
      code,
      { required: 0, covered: 0, partial: 0, missing: 0 },
    ])
  );
  for (const flow of flows) {
    for (const item of flow.cases) {
      if (item.required === false) continue;
      const bucket = byCat[item.category];
      if (!bucket) continue;
      bucket.required += 1;
      if (bucket[item.status] !== undefined) bucket[item.status] += 1;
    }
  }
  return Object.entries(CATEGORIES).map(([code, meaning]) => {
    const stats = byCat[code];
    return {
      code,
      meaning,
      ...stats,
      pct: stats.required
        ? Math.round((stats.covered / stats.required) * 100)
        : 0,
    };
  });
}

export function evaluateScenarioMatrix(specFiles) {
  const flows = SCENARIO_FLOWS.map((flow) => {
    const cases = flow.cases.map((testcase) =>
      evaluateCase(testcase, specFiles)
    );
    const required = cases.filter((item) => item.required !== false);
    const covered = required.filter((item) => item.status === "covered").length;
    const partial = required.filter((item) => item.status === "partial").length;
    const missing = required.filter((item) => item.status === "missing").length;
    return {
      id: flow.id,
      name: flow.name,
      cases,
      required: required.length,
      covered,
      partial,
      missing,
      pct: required.length ? Math.round((covered / required.length) * 100) : 0,
    };
  });

  const required = flows.reduce((n, flow) => n + flow.required, 0);
  const covered = flows.reduce((n, flow) => n + flow.covered, 0);
  const partial = flows.reduce((n, flow) => n + flow.partial, 0);
  const missing = flows.reduce((n, flow) => n + flow.missing, 0);
  const deferred = flows.reduce(
    (n, flow) =>
      n + flow.cases.filter((item) => item.required === false).length,
    0
  );
  return {
    flows,
    required,
    covered,
    partial,
    missing,
    deferred,
    pct: required ? Math.round((covered / required) * 100) : 0,
    categories: categoryStats(flows),
  };
}
