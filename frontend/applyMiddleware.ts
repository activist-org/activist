// SPDX-License-Identifier: AGPL-3.0-or-later
import type { NuxtPage } from "nuxt/schema";
import type { RouteLocationNormalizedGeneric } from "vue-router";

type MiddlewareFunction = (
  to?: RouteLocationNormalizedGeneric,
  from?: RouteLocationNormalizedGeneric
) => unknown;

function setMiddleware(
  pattern: RegExp,
  middleware: string | MiddlewareFunction | Array<string | MiddlewareFunction>,
  pages: NuxtPage[],
  pageKey: "name" | "path" | "file" = "name"
) {
  for (const page of pages) {
    if (page[pageKey] !== undefined && pattern.test(page[pageKey])) {
      // Options are name, path and file.
      page.meta ||= {};
      // Note: NuxtPageMeta types values as unknown, so narrow before concatenating.
      const existing = page.meta.middleware as
        | string
        | MiddlewareFunction
        | Array<string | MiddlewareFunction>
        | undefined;
      const current = existing
        ? Array.isArray(existing)
          ? existing
          : [existing]
        : [];
      page.meta.middleware = current.concat(middleware);
    }
    if (page.children) {
      setMiddleware(pattern, middleware, page.children, pageKey);
    }
  }
}

export default function applyMiddleware(pages: NuxtPage[]) {
  setMiddleware(/home/, "user-only", pages, "name");
}
