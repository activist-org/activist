// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Clear query params when the route path changes.
 * Prevents stale filter params from persisting when navigating between
 * different sections (e.g. /events -> /organizations).
 * Fix for: https://github.com/activist-org/activist/issues/1738
 */
export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client-side navigation (skip initial load/refresh)
  if (!from.name) {
    return;
  }

  // Path changed and destination has query - clear to prevent cross-route pollution.
  // Must check to.query (not from.query) to avoid infinite redirect: after we redirect,
  // the next run has to.query empty, so we stop.
  if (from.path !== to.path && Object.keys(to.query || {}).length > 0) {
    return navigateTo({ path: to.path, query: {} }, { replace: true });
  }
});
