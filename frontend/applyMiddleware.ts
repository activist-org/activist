// SPDX-License-Identifier: AGPL-3.0-or-later
import type { NuxtPage } from "nuxt/schema";
import type { RouteLocationNormalizedGeneric } from "vue-router";

type MiddlewareFunction = (
  to?: RouteLocationNormalizedGeneric,
  from?: RouteLocationNormalizedGeneric
) => unknown;

/**
 * Applies middleware functions to specific routes based on pattern matching of route names, paths, or file paths.
 * @param pages - An array of NuxtPage objects representing the application's routes, which will be modified in-place to include the specified middleware functions in their meta properties based on matching criteria.
 */
export default function applyMiddleware(pages: NuxtPage[]) {
  /**
   *
   * @param pattern - A regular expression pattern to match against the specified page key (name, path, or file) of each route.
   * @param middleware - A middleware function or an array of middleware functions to apply to routes that match the pattern.
   * @param pages - An array of NuxtPage objects to recursively search through and apply the middleware to matching routes.
   * @param pageKey - The key of the NuxtPage object to match against the pattern, which can be "name", "path", or "file". Defaults to "name".
   */
  function setMiddleware(
    pattern: RegExp,
    middleware:
      | string
      | MiddlewareFunction
      | Array<string | MiddlewareFunction>,
    pages: NuxtPage[],
    pageKey: "name" | "path" | "file" = "name"
  ) {
    for (const page of pages) {
      if (page[pageKey] !== undefined && pattern.test(page[pageKey])) {
        // Options are name, path and file.
        page.meta ||= {};
        page.meta.middleware ||= [];
        if (!Array.isArray(page.meta.middleware)) {
          page.meta.middleware = [page.meta.middleware];
        }
        page.meta.middleware = page.meta.middleware.concat(middleware);
      }
      if (page.children) {
        setMiddleware(pattern, middleware, page.children, pageKey);
      }
    }
  }

  setMiddleware(/events-create/, "user-only", pages, "name");
  setMiddleware(/groups-create/, "user-only", pages, "name");
  setMiddleware(/organizations-create/, "user-only", pages, "name");
  setMiddleware(/resources-create/, "user-only", pages, "name");
}
