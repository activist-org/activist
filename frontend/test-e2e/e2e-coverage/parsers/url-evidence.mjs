// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Input: specs, actions, and page objects. Output: which URLs the suite visits.
 *
 * This is route coverage only. A visited URL does not mean the behaviors on
 * that page are checked, which is what the scenario catalog is for.
 */

import { readFileSync } from "fs";

import { posixRel, walkFiles } from "../utils/fs-walk.mjs";
import { ROOT, URL_EVIDENCE_DIRS } from "../utils/paths.mjs";

/** Routes named in page.goto / waitForURL / toHaveURL, as strings or regexes. */
export function extractRoutes(content) {
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

/** Map of visited route to the files that visit it. */
export function collectUrlEvidence() {
  const byRoute = new Map();
  for (const scanDir of URL_EVIDENCE_DIRS) {
    for (const file of walkFiles(scanDir, ".ts")) {
      for (const route of extractRoutes(readFileSync(file, "utf8"))) {
        if (!byRoute.has(route)) byRoute.set(route, []);
        byRoute.get(route).push(posixRel(ROOT, file));
      }
    }
  }
  return byRoute;
}

export function routeIsExercised(appRoute, coveredRoutesBySpec) {
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
