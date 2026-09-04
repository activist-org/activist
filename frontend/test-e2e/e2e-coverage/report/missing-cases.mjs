// SPDX-License-Identifier: AGPL-3.0-or-later
/** Shared shaping of the scenario gaps that the coverage gate enforces. */

export function collectMissingCases(matrix) {
  return matrix.flows.flatMap((flow) =>
    flow.cases
      .filter((item) => item.status === "missing" && item.required !== false)
      .map((item) => ({ flow, item }))
  );
}

export function missWhy(item) {
  if (item.reason === "title_miss") return "spec found, title did not match";
  return "no spec file matches";
}
