// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Input: `test-e2e/specs/**.spec.ts`. Output: one record per spec file with its
 * `test()` titles, so the catalog can be matched without running Playwright.
 */

import { readFileSync } from "fs";

import { posixRel, walkFiles } from "../utils/fs-walk.mjs";
import { ROOT, SPECS_DIR } from "../utils/paths.mjs";
import { scenariosFor } from "./scenario-tags.mjs";

/** `test()` titles, flagging the ones that never run. */
export function extractTests(content) {
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

/** Which viewport folder a spec lives in. */
export function specBucket(specPath) {
  if (specPath.includes("/specs/desktop/")) return "desktop";
  if (specPath.includes("/specs/mobile/")) return "mobile";
  return "all";
}

/** The gate spec scores the catalog, so counting it as suite coverage would be circular. */
const EXCLUDED_PREFIX = "test-e2e/specs/all/e2e-coverage/";

export function collectSpecs() {
  return walkFiles(SPECS_DIR, ".spec.ts")
    .map((file) => ({ file, rel: posixRel(ROOT, file) }))
    .filter(({ rel }) => !rel.startsWith(EXCLUDED_PREFIX))
    .map(({ file, rel }) => {
      const content = readFileSync(file, "utf8");
      const tests = extractTests(content);
      const haystack = `${rel} ${tests.map((t) => t.title).join(" ")}`;
      return {
        file: rel,
        bucket: specBucket(rel),
        tests,
        testCount: tests.length,
        skippedCount: tests.filter((t) => t.skipped).length,
        scenarios: [...new Set(scenariosFor(haystack))],
      };
    });
}
