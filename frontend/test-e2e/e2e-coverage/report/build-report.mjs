// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Turns the parsed inputs into the single report object every renderer reads.
 * Static analysis only: nothing here starts a browser or a server.
 */

import { collectSpecs } from "../parsers/spec-file.mjs";
import {
  collectUrlEvidence,
  routeIsExercised,
} from "../parsers/url-evidence.mjs";
import { collectRoutes } from "../parsers/vue-route.mjs";
import { MIN_REQUIRED_SCENARIO_PCT } from "../scoring/constants.mjs";
import { evaluateScenarioMatrix } from "../scoring/evaluate-matrix.mjs";
import {
  ROUTE_FLOWS,
  flowForSpec,
  flowStatus,
} from "../scoring/route-flows.mjs";
import { gitMeta } from "../utils/git-meta.mjs";

export function buildReport() {
  const routeRecords = collectRoutes();
  const specFiles = collectSpecs().map((spec) => ({
    ...spec,
    flow: flowForSpec(spec.file)?.id ?? "other",
  }));
  const { branch, sha } = gitMeta();
  const coveredRoutesBySpec = collectUrlEvidence();

  const allRoutes = routeRecords.map((r) => r.route);
  const stubRoutes = routeRecords.filter((r) => r.stub).map((r) => r.route);
  const testableRecords = routeRecords.filter((r) => !r.stub);
  const testableRoutes = testableRecords.map((r) => r.route);

  const covered = allRoutes.filter((r) =>
    routeIsExercised(r, coveredRoutesBySpec)
  );
  const uncovered = allRoutes.filter(
    (r) => !routeIsExercised(r, coveredRoutesBySpec)
  );
  const coveredTestable = testableRoutes.filter((r) =>
    routeIsExercised(r, coveredRoutesBySpec)
  );
  const uncoveredTestable = testableRoutes.filter(
    (r) => !routeIsExercised(r, coveredRoutesBySpec)
  );

  const pct = allRoutes.length
    ? Math.round((covered.length / allRoutes.length) * 100)
    : 0;
  const pctTestable = testableRoutes.length
    ? Math.round((coveredTestable.length / testableRoutes.length) * 100)
    : 0;

  const buckets = { all: 0, desktop: 0, mobile: 0 };
  for (const s of specFiles) buckets[s.bucket] += 1;

  const testCount = specFiles.reduce((n, s) => n + s.testCount, 0);
  const skippedCount = specFiles.reduce((n, s) => n + s.skippedCount, 0);

  const flows = ROUTE_FLOWS.map((flow) => {
    const routes = routeRecords.filter((rec) => flow.route(rec.route, rec));
    const specs = specFiles.filter((s) => s.flow === flow.id);
    const testable = routes.filter((rec) => !rec.stub);
    const testableCovered = testable.filter((rec) =>
      routeIsExercised(rec.route, coveredRoutesBySpec)
    );
    const scenarios = [...new Set(specs.flatMap((s) => s.scenarios))];
    const status = flowStatus(
      flow,
      specs,
      testable,
      testableCovered,
      scenarios
    );

    return {
      id: flow.id,
      name: flow.name,
      routes: routes.map((r) => r.route),
      stubRoutes: routes.filter((r) => r.stub).map((r) => r.route),
      specCount: specs.length,
      testCount: specs.reduce((n, s) => n + s.testCount, 0),
      specs: specs.map((s) => s.file.replace(/^test-e2e\/specs\//, "")),
      scenarios,
      testableRoutes: testable.length,
      coveredTestableRoutes: testableCovered.length,
      status,
    };
  });

  const unassignedSpecs = specFiles.filter((s) => s.flow === "other");
  const scenarioMatrix = evaluateScenarioMatrix(specFiles);

  return {
    generatedAt: new Date().toISOString().slice(0, 10),
    branch,
    sha,
    specFiles: specFiles.length,
    specBuckets: buckets,
    testCount,
    skippedCount,
    totalRoutes: allRoutes.length,
    stubRoutes: stubRoutes.length,
    testableRoutes: testableRoutes.length,
    covered: covered.length,
    uncovered: uncovered.length,
    coveragePercent: pct,
    coveredTestable: coveredTestable.length,
    uncoveredTestable: uncoveredTestable.length,
    coveragePercentTestable: pctTestable,
    coveredRoutes: covered,
    uncoveredRoutes: uncovered,
    stubRoutesList: stubRoutes,
    uncoveredTestableRoutes: uncoveredTestable,
    flows,
    unassignedSpecs: unassignedSpecs.map((s) => s.file),
    scenarioMatrix,
    minRequiredScenarioPct: MIN_REQUIRED_SCENARIO_PCT,
  };
}
