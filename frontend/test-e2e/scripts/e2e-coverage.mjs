// SPDX-License-Identifier: AGPL-3.0-or-later
/* eslint-disable no-console */
/**
 * E2E coverage: app routes vs specs, plus a regenerable flow/scenario report.
 *
 * URL evidence is taken from specs, actions, and page objects
 * (page.goto / waitForURL / toHaveURL).
 *
 * Usage (from frontend/):
 *   node test-e2e/scripts/e2e-coverage.mjs
 *   node test-e2e/scripts/e2e-coverage.mjs --json
 *   node test-e2e/scripts/e2e-coverage.mjs --markdown
 *   node test-e2e/scripts/e2e-coverage.mjs --uncovered
 *   node test-e2e/scripts/e2e-coverage.mjs --full --markdown
 *   node test-e2e/scripts/e2e-coverage.mjs --full --markdown --out
 */

import { execSync } from "child_process";
import {
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "fs";
import { dirname, join, relative } from "path";
import { fileURLToPath } from "url";

import { CATEGORIES, ID_PREFIXES, SCENARIO_FLOWS } from "../scenario-matrix.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "../..");
const PAGES_DIR = join(ROOT, "app/pages");
const SPECS_DIR = join(ROOT, "test-e2e/specs");

const args = parseArgs(process.argv.slice(2));

// MARK: CLI

function parseArgs(argv) {
  const parsed = {
    json: false,
    markdown: false,
    uncovered: false,
    full: false,
    out: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--json") parsed.json = true;
    else if (a === "--markdown" || a === "--md") parsed.markdown = true;
    else if (a === "--uncovered") parsed.uncovered = true;
    else if (a === "--full") parsed.full = true;
    else if (a === "--out") parsed.out = true;
  }
  if (parsed.full) parsed.markdown = true;
  return parsed;
}

function walkFiles(dir, ext) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...walkFiles(full, ext));
    } else if (entry.endsWith(ext) && !entry.endsWith(".d.ts")) {
      results.push(full);
    }
  }
  return results;
}

function posixRel(from, file) {
  return relative(from, file).split("\\").join("/");
}

function gitMeta() {
  try {
    const opts = { encoding: "utf8", cwd: ROOT };
    return {
      branch: execSync("git rev-parse --abbrev-ref HEAD", opts).trim(),
      sha: execSync("git rev-parse --short HEAD", opts).trim(),
    };
  } catch {
    return { branch: "unknown", sha: "unknown" };
  }
}

// MARK: Routes

function vueFileToRoute(filePath) {
  let rel = relative(PAGES_DIR, filePath)
    .replace(/\.vue$/, "")
    .replace(/\/index$/, "")
    .replace(/^index$/, "")
    .replace(/\[eventId\]/g, ":id")
    .replace(/\[orgId\]/g, ":id")
    .replace(/\[groupId\]/g, ":id")
    .replace(/\[code\]/g, ":code")
    .replace(/\[id\]/g, ":id")
    .replace(/\[([^\]]+)\]/g, ":$1");

  return rel === "" ? "/" : `/${rel}`;
}

function isLayoutWrapper(content) {
  return (
    content.includes("<NuxtPage") &&
    (content.includes("<NuxtLayout") || /<NuxtPage\s*\/>/.test(content)) &&
    !content.includes("HeaderAppPage")
  );
}

function isStubPage(content) {
  if (/:underDevelopment="true"/.test(content)) return true;
  const template = content.match(/<template>([\s\S]*?)<\/template>/);
  if (!template) return false;
  const inner = template[1]
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, "")
    .trim();
  return inner.length === 0;
}

function collectRoutes() {
  const byRoute = new Map();
  for (const file of walkFiles(PAGES_DIR, ".vue")) {
    const content = readFileSync(file, "utf8");
    if (isLayoutWrapper(content)) continue;
    const route = vueFileToRoute(file);
    const prev = byRoute.get(route);
    const stub = isStubPage(content);
    if (!prev) {
      byRoute.set(route, { route, stub, files: [file] });
    } else {
      prev.files.push(file);
      prev.stub = prev.stub && stub;
    }
  }
  return [...byRoute.values()].sort((a, b) => a.route.localeCompare(b.route));
}

// MARK: URL evidence

function extractRoutes(content) {
  const found = new Set();

  const STRING_RE =
    /(?:page\.goto|goto|waitForURL|toHaveURL)\s*\(\s*['"`](?:\*\*)?(\/?[a-z][^'"`?#\s]*)/gi;
  let m;
  while ((m = STRING_RE.exec(content)) !== null) {
    const raw = m[1].startsWith("/") ? m[1] : `/${m[1]}`;
    if (!raw.startsWith("http")) found.add(raw.replace(/\/+$/, "") || "/");
  }

  const REGEX_RE = /(?:toHaveURL|waitForURL)\s*\(\s*\/([^,)]+)\//g;
  while ((m = REGEX_RE.exec(content)) !== null) {
    const route =
      "/" +
      m[1]
        .replace(/\\\//g, "/")
        .replace(/\.\*/g, ":id")
        .replace(/^:id\//, "");
    if (route.length > 1 && !route.startsWith("http") && !route.includes("=")) {
      found.add(route);
    }
  }

  return found;
}

function routeIsExercised(appRoute, coveredRoutesBySpec) {
  if (
    appRoute === "/" &&
    (coveredRoutesBySpec.has("/") || coveredRoutesBySpec.has("/en"))
  ) {
    return true;
  }

  if (coveredRoutesBySpec.has(appRoute)) return true;

  for (const specRoute of coveredRoutesBySpec.keys()) {
    const specParts = specRoute.split("/").filter(Boolean);
    const appParts = appRoute.split("/").filter(Boolean);

    if (specParts.length === appParts.length) {
      if (
        specParts.every((seg, i) => {
          const app = appParts[i];
          return seg === app || app?.startsWith(":") || seg?.startsWith(":");
        })
      ) {
        return true;
      }
    }

    // /groups/:id/faq covers /organizations/:id/groups/:id/faq. The first spec
    // segment must be a concrete name so /organizations/:id does not cover
    // every org subpage.
    if (specParts.length < appParts.length && !specParts[0]?.startsWith(":")) {
      const suffix = appParts.slice(appParts.length - specParts.length);
      if (
        specParts[0] === suffix[0] &&
        specParts.every((seg, i) => {
          const app = suffix[i];
          return seg === app || app?.startsWith(":") || seg?.startsWith(":");
        })
      ) {
        return true;
      }
    }
  }

  return false;
}

// MARK: Spec inventory

const SCENARIOS = [
  { id: "a11y", label: "accessibility", re: /accessib|a11y|\baxe\b/i },
  { id: "val", label: "validation", re: /validat|required field|invalid/i },
  { id: "empty", label: "empty states", re: /empty/i },
  {
    id: "err",
    label: "API / server errors",
    re: /server.error|api.error|network error|rate.?limit/i,
  },
  {
    id: "perm",
    label: "permissions",
    re: /permission|unauthor|forbidden|\brole\b|\badmin\b|\bguest\b/i,
  },
  {
    id: "auth",
    label: "authentication",
    re: /sign.in|sign.up|sign.out|password.reset|confirm email/i,
  },
  {
    id: "crud",
    label: "create / edit / delete",
    re: /\bcreate\b|\bupdate\b|\bedit\b|\bdelete\b|\breorder\b|\bdrag\b/i,
  },
  {
    id: "int",
    label: "filters / share / QR",
    re: /filter|paginat|share|\bqr\b|social|subscribe|topic/i,
  },
];

function extractTests(content) {
  const tests = [];
  const re = /\btest(?:\.(skip|fixme|only))?\s*\(\s*(['"`])([\s\S]*?)\2/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    tests.push({
      skipped: m[1] === "skip" || m[1] === "fixme",
      title: m[3].replace(/\s+/g, " ").trim(),
    });
  }
  return tests;
}

function scenariosFor(text) {
  return SCENARIOS.filter((s) => s.re.test(text)).map((s) => s.id);
}

const FLOWS = [
  {
    id: "F01",
    name: "Landing",
    route: (r) => r === "/",
    spec: (p) => p.includes("/landing-page"),
  },
  {
    id: "F02",
    name: "Sign in",
    route: (r) => r === "/auth/sign-in",
    spec: (p) => p.includes("/sign-in"),
  },
  {
    id: "F03",
    name: "Sign up",
    route: (r) => r === "/auth/sign-up",
    spec: (p) => p.includes("/sign-up"),
  },
  {
    id: "F04",
    name: "Password reset",
    route: (r) =>
      r.startsWith("/auth/pwreset") ||
      r === "/auth/reset-password" ||
      r === "/auth/set-password",
    spec: (p) => p.includes("password-reset"),
  },
  {
    id: "F05",
    name: "Email confirm",
    route: (r) => r.startsWith("/auth/confirm"),
    spec: (p) => p.includes("sign-up-authentication"),
  },
  {
    id: "F06",
    name: "Auth hub",
    route: (r) => r === "/auth",
    spec: () => false,
  },
  {
    id: "F07",
    name: "Sign out",
    route: () => false,
    spec: (p) => p.includes("/sign-out"),
  },
  {
    id: "F08",
    name: "Home",
    route: (r) => r === "/home",
    spec: (p) => /\/home-page\.spec\.ts$/.test(p),
  },
  {
    id: "F09",
    name: "Events catalog",
    route: (r) => r === "/events",
    spec: (p) =>
      p.includes("/events-list/") ||
      p.includes("/events-filter") ||
      p.includes("/events-pagination"),
  },
  {
    id: "F10",
    name: "Event about",
    route: (r) => r === "/events/:id/about" || r === "/events/:id",
    spec: (p) => p.includes("/event-about"),
  },
  {
    id: "F11",
    name: "Event FAQ",
    route: (r) => r === "/events/:id/faq",
    spec: (p) => p.includes("/event-faq"),
  },
  {
    id: "F12",
    name: "Event resources",
    route: (r) => r === "/events/:id/resources",
    spec: (p) => p.includes("/event-resources"),
  },
  {
    id: "F13",
    name: "Event create (modal)",
    route: () => false,
    spec: (p) =>
      p.includes("create-flows/event") || p.includes("/events-create/"),
  },
  {
    id: "F14",
    name: "Organizations catalog",
    route: (r) => r === "/organizations",
    spec: (p) =>
      p.includes("/organizations-list/") || p.includes("/organizations-filter"),
  },
  {
    id: "F15",
    name: "Organization about",
    route: (r) =>
      r === "/organizations/:id/about" || r === "/organizations/:id",
    spec: (p) =>
      p.includes("/organization-about") || p.includes("/organization-logo"),
  },
  {
    id: "F16",
    name: "Organization FAQ",
    route: (r) => r === "/organizations/:id/faq",
    spec: (p) => p.includes("/organization-faq") && !p.includes("/groups/"),
  },
  {
    id: "F17",
    name: "Organization resources",
    route: (r) => r === "/organizations/:id/resources",
    spec: (p) =>
      p.includes("/organization-resources") && !p.includes("/groups/"),
  },
  {
    id: "F18",
    name: "Organization events",
    route: (r) => r === "/organizations/:id/events",
    spec: (p) => p.includes("/organization-events"),
  },
  {
    id: "F19",
    name: "Organization groups list",
    route: (r) => r === "/organizations/:id/groups",
    spec: (p) => p.includes("organization-groups-page"),
  },
  {
    id: "F20",
    name: "Organization create (modal)",
    route: () => false,
    spec: (p) =>
      p.includes("create-flows/organization") ||
      p.includes("/organizations-create/"),
  },
  {
    id: "F21",
    name: "Group about",
    route: (r) => r.endsWith("/groups/:id/about") || r.endsWith("/groups/:id"),
    spec: (p) => p.includes("/organization-group-about"),
  },
  {
    id: "F22",
    name: "Group FAQ",
    route: (r) => r.endsWith("/groups/:id/faq"),
    spec: (p) => p.includes("/organization-group-faq"),
  },
  {
    id: "F23",
    name: "Group resources",
    route: (r) => r.endsWith("/groups/:id/resources"),
    spec: (p) => p.includes("/organization-group-resources"),
  },
  {
    id: "F24",
    name: "Group events",
    route: (r) => r.endsWith("/groups/:id/events"),
    spec: (p) => p.includes("/organization-group-events"),
  },
  {
    id: "F25",
    name: "Group create (modal)",
    route: () => false,
    spec: (p) =>
      p.includes("create-flows/group") ||
      p.includes("/organization-group-create/"),
  },
  {
    id: "F26",
    name: "Global search",
    route: (r) => r === "/search" || r.endsWith("/search"),
    spec: (p) => p.includes("/search"),
  },
  {
    id: "F27",
    name: "Global groups catalog",
    route: (r) => r === "/groups",
    spec: () => false,
  },
  {
    id: "F28",
    name: "Contact",
    route: (r) => r === "/contact",
    spec: () => false,
  },
  {
    id: "F29",
    name: "Route query / topics",
    route: () => false,
    spec: (p) => p.includes("route-query-topics"),
  },
  {
    id: "F30",
    name: "Stub subpages",
    route: (_r, rec) => Boolean(rec?.stub),
    spec: () => false,
  },
];

function flowForSpec(specPath) {
  return FLOWS.find((f) => f.spec(specPath));
}

function flowStatus(flow, specs, testable, testableCovered, scenarios) {
  if (flow.id === "F30") return "n/a";
  if (specs.length === 0 && testableCovered.length === 0) return "none";
  if (testable.length > 0 && testableCovered.length < testable.length) {
    return "partial";
  }
  if (specs.length === 0) return "covered";
  if (scenarios.length < 2 && specs.length < 3) return "light";
  return "covered";
}

function specBucket(specPath) {
  if (specPath.includes("/specs/desktop/")) return "desktop";
  if (specPath.includes("/specs/mobile/")) return "mobile";
  return "all";
}

function collectSpecs() {
  return walkFiles(SPECS_DIR, ".spec.ts").map((file) => {
    const content = readFileSync(file, "utf8");
    const rel = posixRel(ROOT, file);
    const tests = extractTests(content);
    const haystack = `${rel} ${tests.map((t) => t.title).join(" ")}`;
    return {
      file: rel,
      bucket: specBucket(rel),
      tests,
      testCount: tests.length,
      skippedCount: tests.filter((t) => t.skipped).length,
      scenarios: [...new Set(scenariosFor(haystack))],
      flow: flowForSpec(rel)?.id ?? "other",
    };
  });
}

function shortSpec(file) {
  return file.replace(/^test-e2e\/specs\//, "");
}

function testTitlesOf(tests) {
  return [...new Set(tests.map((t) => t.title))];
}

function evaluateCase(testcase, specFiles) {
  const matched = specFiles.filter((s) =>
    testcase.spec.some((frag) => s.file.includes(frag))
  );
  if (matched.length === 0) {
    return {
      ...testcase,
      status: "missing",
      reason: "no_spec",
      specs: [],
      testTitles: [],
    };
  }

  if (testcase.title) {
    const re = new RegExp(testcase.title, "i");
    const tests = matched.flatMap((s) =>
      s.tests
        .filter((t) => re.test(t.title))
        .map((t) => ({ ...t, file: s.file }))
    );
    if (tests.length === 0) {
      return {
        ...testcase,
        status: "missing",
        reason: "title_miss",
        specs: matched.map((s) => s.file),
        testTitles: [],
      };
    }
    const active = tests.filter((t) => !t.skipped);
    return {
      ...testcase,
      status: active.length === 0 ? "partial" : "covered",
      specs: [...new Set(tests.map((t) => t.file))],
      testTitles: testTitlesOf(active.length ? active : tests),
    };
  }

  const tests = matched.flatMap((s) =>
    s.tests.map((t) => ({ ...t, file: s.file }))
  );
  const allSkipped = matched.every(
    (s) => s.testCount > 0 && s.skippedCount === s.testCount
  );
  const active = tests.filter((t) => !t.skipped);
  return {
    ...testcase,
    status: allSkipped ? "partial" : "covered",
    specs: matched.map((s) => s.file),
    testTitles: testTitlesOf(active.length ? active : tests),
  };
}

function evaluateScenarioMatrix(specFiles) {
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
  return {
    flows,
    required,
    covered,
    partial,
    missing,
    pct: required ? Math.round((covered / required) * 100) : 0,
    categories: categoryStats(flows),
  };
}

function categoryStats(flows) {
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

// MARK: Report data

function buildReport() {
  const routeRecords = collectRoutes();
  const specFiles = collectSpecs();
  const { branch, sha } = gitMeta();

  const coveredRoutesBySpec = new Map();
  const SCAN_DIRS = [
    SPECS_DIR,
    join(ROOT, "test-e2e/actions"),
    join(ROOT, "test-e2e/page-objects"),
  ];
  for (const scanDir of SCAN_DIRS) {
    for (const file of walkFiles(scanDir, ".ts")) {
      const routes = extractRoutes(readFileSync(file, "utf8"));
      for (const route of routes) {
        if (!coveredRoutesBySpec.has(route)) coveredRoutesBySpec.set(route, []);
        coveredRoutesBySpec.get(route).push(posixRel(ROOT, file));
      }
    }
  }

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

  const flows = FLOWS.map((flow) => {
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
  };
}

// MARK: Render

function renderSimpleMarkdown(report) {
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

function missWhy(item) {
  if (item.reason === "title_miss") return "spec found, title did not match";
  return "no spec file matches";
}

function caseStatusLabel(item) {
  if (item.status === "covered") return "✅";
  if (item.status === "partial") return "⚠️ skipped";
  if (item.reason === "title_miss") return "❌ title";
  return "❌ no spec";
}

function formatMatchedTests(item) {
  if (item.status === "missing") return "-";
  const titles = item.testTitles ?? [];
  if (titles.length === 0) return "-";
  const shown = titles.slice(0, 3).map((title) =>
    `\`${title.replace(/\|/g, "/")}\``
  );
  const extra =
    titles.length > 3 ? `, +${titles.length - 3} more` : "";
  return `${shown.join(", ")}${extra}`;
}

function renderFullMarkdown(report) {
  const matrix = report.scenarioMatrix;
  const lines = [];
  lines.push(`# E2E scenario coverage report`);
  lines.push("");
  lines.push(
    `Generated **${report.generatedAt}** on \`${report.branch}\` (\`${report.sha}\`).`
  );
  lines.push("");
  lines.push(
    "This is a **scenario** report (behaviors we agreed to protect), not a route-hit count. The catalog lives in `frontend/test-e2e/scenario-matrix.mjs`. A cell is covered when a current spec path matches, and a `test()` title matches when one is required."
  );
  lines.push("");
  lines.push("Regenerate from `frontend/`:");
  lines.push("");
  lines.push("```bash");
  lines.push("node test-e2e/scripts/e2e-coverage.mjs --full --markdown --out");
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

  const missing = matrix.flows.flatMap((flow) =>
    flow.cases
      .filter((item) => item.status === "missing" && item.required !== false)
      .map((item) => ({ flow, item }))
  );
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

  lines.push("## Flow details");
  lines.push("");
  for (const flow of matrix.flows) {
    lines.push(`### ${flow.id} ${flow.name}`);
    lines.push("");
    lines.push(`**${flow.covered}/${flow.required}** covered (${flow.pct}%).`);
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

function renderTerminal(report) {
  const GREEN = "\x1b[32m";
  const RED = "\x1b[31m";
  const YELLOW = "\x1b[33m";
  const DIM = "\x1b[2m";
  const BOLD = "\x1b[1m";
  const RESET = "\x1b[0m";
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
    const colorScenarios =
      matrix.pct >= 80 ? GREEN : matrix.pct >= 60 ? YELLOW : RED;
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
    const colorAll =
      report.coveragePercent >= 80
        ? GREEN
        : report.coveragePercent >= 60
          ? YELLOW
          : RED;
    const colorTestable =
      report.coveragePercentTestable >= 90
        ? GREEN
        : report.coveragePercentTestable >= 74
          ? YELLOW
          : RED;
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

  lines.push(`\n${BOLD}${RED}Uncovered Testable Routes${RESET}`);
  lines.push("-".repeat(50));
  for (const r of report.uncoveredTestableRoutes) {
    lines.push(`  ${RED}✗${RESET}  ${r}`);
  }
  lines.push("");
  lines.push(
    `${DIM}Full flow report: node test-e2e/scripts/e2e-coverage.mjs --full --markdown${RESET}`
  );
  lines.push("");
  return lines.join("\n");
}

function emit(text) {
  if (args.out) {
    const filename = args.json
      ? "e2e-coverage-latest.json"
      : "e2e-coverage-latest.md";
    const outPath = join(ROOT, "test-results", filename);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, text.endsWith("\n") ? text : `${text}\n`);
    console.log(`Wrote ${outPath}`);
    return;
  }
  process.stdout.write(text.endsWith("\n") ? text : `${text}\n`);
}

const report = buildReport();

if (args.json) {
  emit(JSON.stringify(report, null, 2));
} else if (args.full) {
  emit(renderFullMarkdown(report));
} else if (args.markdown) {
  emit(renderSimpleMarkdown(report));
} else {
  emit(renderTerminal(report));
}
