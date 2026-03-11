// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Clear query params when the route path changes.
 * Prevents stale filter params from persisting when navigating between
 * different sections (e.g. /events -> /organizations).
 * @see https://github.com/activist-org/activist/issues/1738
 */
export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client-side navigation (skip initial load/refresh).
  if (!from.name) {
    return;
  }

  // Allow intentional cross-path query navigation (e.g. post-creation redirects) to
  // preserve their query params. The flag is consumed immediately (one-time use).
  const preserveNextQuery = useState("preserveNextQuery", () => false);
  if (preserveNextQuery.value) {
    preserveNextQuery.value = false;
    console.log("Query Preserved..."); // eslint-disable-line no-console
    return;
  }

  // Path changed and destination has query - clear to prevent cross-route pollution.
  // Must check to.query (not from.query) to avoid infinite redirect.
  // After we redirect, the next run has to.query empty, so we stop.
  if (from.path !== to.path && Object.keys(to.query || {}).length > 0) {
    return navigateTo({ path: to.path, query: {} }, { replace: true });
  }
});
