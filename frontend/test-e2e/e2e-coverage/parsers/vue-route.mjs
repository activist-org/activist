// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Input: `app/pages/**.vue`. Output: the list of app routes to score against.
 *
 * Stub pages (`:underDevelopment` or an empty template) are flagged rather than
 * hardcoded, so a route stops counting as untested work once it is built.
 */

import { readFileSync } from "fs";
import { relative } from "path";

import { walkFiles } from "../utils/fs-walk.mjs";
import { PAGES_DIR } from "../utils/paths.mjs";

/** `app/pages/events/[eventId]/faq.vue` becomes `/events/:id/faq`. */
export function vueFileToRoute(filePath) {
  const rel = relative(PAGES_DIR, filePath)
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

/** Pages that only host a child route are not navigable destinations. */
export function isLayoutWrapper(content) {
  return (
    content.includes("<NuxtPage") &&
    (content.includes("<NuxtLayout") || /<NuxtPage\s*\/>/.test(content)) &&
    !content.includes("HeaderAppPage")
  );
}

/** A route that exists but has no UI to test yet. */
export function isStubPage(content) {
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

/**
 * Every route, sorted, as `{ route, stub, files }`. A route backed by several
 * files is only a stub when all of them are.
 */
export function collectRoutes() {
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
