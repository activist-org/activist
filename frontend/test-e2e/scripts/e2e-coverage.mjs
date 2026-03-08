// SPDX-License-Identifier: AGPL-3.0-or-later
/* eslint-disable no-console */
/**
 * E2E coverage script: compares application routes (from app/pages/) against
 * routes exercised in E2E spec files and navigation helpers.
 *
 * Scans three sources for URL evidence:
 *   1. test-e2e/specs/       — page.goto(), waitForURL(), toHaveURL() in spec files
 *   2. test-e2e/actions/     — waitForURL() in navigation helper files
 *   3. test-e2e/page-objects/ — any URL assertions in page objects
 *
 * Stub routes (underDevelopment pages with no implemented UI) are tracked
 * separately so testable coverage is reported alongside raw coverage.
 *
 * Usage:
 *   node test-e2e/scripts/e2e-coverage.mjs
 *   node test-e2e/scripts/e2e-coverage.mjs --json        # machine-readable JSON output
 *   node test-e2e/scripts/e2e-coverage.mjs --markdown    # GitHub-flavored markdown output
 *   node test-e2e/scripts/e2e-coverage.mjs --uncovered   # only show uncovered routes
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "../..");
const PAGES_DIR = join(ROOT, "app/pages");

const args = process.argv.slice(2);
const JSON_MODE = args.includes("--json");
const MARKDOWN_MODE = args.includes("--markdown") || args.includes("--md");
const UNCOVERED_ONLY = args.includes("--uncovered");

// ---------------------------------------------------------------------------
// 1. Enumerate application routes from app/pages/
// ---------------------------------------------------------------------------

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

  // Layout/wrapper files that are not navigable routes.
  const SKIP = new Set([
    "auth",
    "events/:id",
    "organizations/:id",
    "organizations/:id/groups/:id",
    "groups",
    "resources",
    "search",
  ]);
  if (SKIP.has(rel)) return null;

  return rel === "" ? "/" : `/${rel}`;
}

// Routes whose page body is fully commented out (:underDevelopment stubs).
// These exist as navigable URLs but have no implemented UI to test against.
const STUB_ROUTES = new Set([
  "/events/:id/discussion",
  "/events/:id/settings",
  "/events/:id/tasks",
  "/events/:id/team",
  "/organizations/:id/application",
  "/organizations/:id/settings",
  "/organizations/:id/tasks",
  "/organizations/:id/team",
]);

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

const allRoutes = [
  ...new Set(
    walkFiles(PAGES_DIR, ".vue").map(vueFileToRoute).filter(Boolean).sort()
  ),
];

const testableRoutes = allRoutes.filter((r) => !STUB_ROUTES.has(r));
const stubRoutes = allRoutes.filter((r) => STUB_ROUTES.has(r));

// ---------------------------------------------------------------------------
// 2. Extract URL patterns from specs + navigation helpers + page objects
// ---------------------------------------------------------------------------

function extractRoutes(content) {
  const found = new Set();

  // String literals: page.goto('/path'), waitForURL('**/path'), toHaveURL('/path')
  const STRING_RE =
    /(?:page\.goto|goto|waitForURL|toHaveURL)\s*\(\s*['"`](?:\*\*)?(\/?[a-z][^'"`?#\s]*)/gi;
  let m;
  while ((m = STRING_RE.exec(content)) !== null) {
    const raw = m[1].startsWith("/") ? m[1] : `/${m[1]}`;
    if (!raw.startsWith("http")) found.add(raw.replace(/\/+$/, "") || "/");
  }

  // Regex literals: toHaveURL(/.*\/events\/.*\/faq/) or waitForURL(/.*\/groups\/.*\/faq/)
  const REGEX_RE = /(?:toHaveURL|waitForURL)\s*\(\s*\/([^,)]+)\//g;
  while ((m = REGEX_RE.exec(content)) !== null) {
    const route =
      "/" +
      m[1]
        .replace(/\\\//g, "/") // unescape \/ → /
        .replace(/\.\*/g, ":id") // .* → :id
        .replace(/^:id\//, ""); // strip leading :id/ (from .*/)
    if (route.length > 1 && !route.startsWith("http") && !route.includes("=")) {
      found.add(route);
    }
  }

  return found;
}

// Scan specs, actions, and page-objects for URL evidence.
const SCAN_DIRS = [
  join(ROOT, "test-e2e/specs"),
  join(ROOT, "test-e2e/actions"),
  join(ROOT, "test-e2e/page-objects"),
];

const specFiles = walkFiles(join(ROOT, "test-e2e/specs"), ".spec.ts");
const coveredRoutesBySpec = new Map(); // route -> source files

for (const scanDir of SCAN_DIRS) {
  for (const file of walkFiles(scanDir, ".ts")) {
    const content = readFileSync(file, "utf8");
    const routes = extractRoutes(content);
    for (const route of routes) {
      if (!coveredRoutesBySpec.has(route)) coveredRoutesBySpec.set(route, []);
      coveredRoutesBySpec.get(route).push(relative(ROOT, file));
    }
  }
}

// ---------------------------------------------------------------------------
// 3. Match extracted routes against application routes
// ---------------------------------------------------------------------------

function routeIsExercised(appRoute) {
  // Landing page: specs use `/en` or `/`.
  if (
    appRoute === "/" &&
    (coveredRoutesBySpec.has("/") || coveredRoutesBySpec.has("/en"))
  )
    return true;

  if (coveredRoutesBySpec.has(appRoute)) return true;

  for (const specRoute of coveredRoutesBySpec.keys()) {
    const specParts = specRoute.split("/").filter(Boolean);
    const appParts = appRoute.split("/").filter(Boolean);

    // Same-length segment-wise match: `:param` on either side is a wildcard.
    if (specParts.length === appParts.length) {
      if (
        specParts.every((seg, i) => {
          const app = appParts[i];
          return seg === app || app?.startsWith(":") || seg?.startsWith(":");
        })
      )
        return true;
    }

    // Suffix match: /groups/:id/faq covers /organizations/:id/groups/:id/faq.
    if (specParts.length < appParts.length) {
      const suffix = appParts.slice(appParts.length - specParts.length);
      if (
        specParts.every((seg, i) => {
          const app = suffix[i];
          return seg === app || app?.startsWith(":") || seg?.startsWith(":");
        })
      )
        return true;
    }
  }

  return false;
}

const covered = allRoutes.filter(routeIsExercised);
const uncovered = allRoutes.filter((r) => !routeIsExercised(r));
const pct = Math.round((covered.length / allRoutes.length) * 100);

const coveredTestable = testableRoutes.filter(routeIsExercised);
const uncoveredTestable = testableRoutes.filter((r) => !routeIsExercised(r));
const pctTestable = Math.round(
  (coveredTestable.length / testableRoutes.length) * 100
);

// ---------------------------------------------------------------------------
// 4. Output
// ---------------------------------------------------------------------------

if (JSON_MODE) {
  console.log(
    JSON.stringify(
      {
        specFiles: specFiles.length,
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
      },
      null,
      2
    )
  );
  process.exit(0);
}

if (MARKDOWN_MODE) {
  if (!UNCOVERED_ONLY) {
    console.log(`## E2E Route Coverage\n`);
    console.log(`| Metric | Value |`);
    console.log(`|--------|-------|`);
    console.log(`| Spec files | ${specFiles.length} |`);
    console.log(`| Total routes | ${allRoutes.length} |`);
    console.log(`| Stub/unimplemented routes | ${stubRoutes.length} |`);
    console.log(`| Testable routes | ${testableRoutes.length} |`);
    console.log(`| Covered | ${covered.length} |`);
    console.log(`| Coverage (all routes) | ${pct}% |`);
    console.log(`| **Coverage (testable only)** | **${pctTestable}%** |\n`);

    console.log(`### ✅ Covered Routes (${covered.length})\n`);
    for (const r of covered) console.log(`- \`${r}\``);
    console.log();

    console.log(
      `### ⚠️ Stub Routes — not yet implemented (${stubRoutes.length})\n`
    );
    for (const r of stubRoutes) console.log(`- \`${r}\``);
    console.log();
  }

  console.log(
    `### ❌ Uncovered Testable Routes (${uncoveredTestable.length})\n`
  );
  for (const r of uncoveredTestable) console.log(`- \`${r}\``);
  console.log();
  process.exit(0);
}

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

if (!UNCOVERED_ONLY) {
  console.log(`\n${BOLD}E2E Route Coverage Report${RESET}`);
  console.log("=".repeat(50));
  console.log(`  Spec files:             ${specFiles.length}`);
  console.log(`  Total routes:           ${allRoutes.length}`);
  console.log(`  ${DIM}Stub/unimplemented:     ${stubRoutes.length}${RESET}`);
  console.log(`  Testable routes:        ${testableRoutes.length}`);
  console.log(`  ${GREEN}Covered:${RESET}                ${covered.length}`);
  const colorAll = pct >= 80 ? GREEN : pct >= 60 ? YELLOW : RED;
  const colorTestable =
    pctTestable >= 90 ? GREEN : pctTestable >= 74 ? YELLOW : RED;
  console.log(`  Coverage (all):         ${colorAll}${pct}%${RESET}`);
  console.log(
    `  ${BOLD}Coverage (testable):${RESET}    ${colorTestable}${BOLD}${pctTestable}%${RESET}\n`
  );

  console.log(`${BOLD}${GREEN}Covered Routes${RESET}`);
  console.log("-".repeat(50));
  for (const r of covered) console.log(`  ${GREEN}✓${RESET}  ${r}`);

  console.log(`\n${BOLD}${DIM}Stub Routes (unimplemented)${RESET}`);
  console.log("-".repeat(50));
  for (const r of stubRoutes) console.log(`  ${DIM}~  ${r}${RESET}`);
}

console.log(`\n${BOLD}${RED}Uncovered Testable Routes${RESET}`);
console.log("-".repeat(50));
for (const r of uncoveredTestable) console.log(`  ${RED}✗${RESET}  ${r}`);

console.log();
