import type { NuxtPage } from "nuxt/schema";

export default function applyMiddleware(pages: NuxtPage[]) {
  function setMiddleware(
    pattern: RegExp,
    middleware: string | Function | Array<string | Function>,
    pages: NuxtPage[],
    pageKey: "name" | "path" | "file" = "name"
  ) {
    for (const page of pages) {
      if (page[pageKey] !== undefined && pattern.test(page[pageKey])) {
        // options are name, path, file
        // create paths seem to all be "create"
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
