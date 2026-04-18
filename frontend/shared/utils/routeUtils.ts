// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LocationQueryValue } from "vue-router";

import locales from "#shared/utils/locales";

const localCodes = locales.map((l) => l.code);

/**
 * Normalize a given path by removing leading and trailing slashes.
 * @param path - The route path to normalize, which may contain leading and/or trailing slashes.
 * @returns The normalized path without leading or trailing slashes.
 */
function normalizePath(path: string): string {
  return path.replace(/^\/+/g, "").replace(/\/+$/g, "");
}

/**
 * Remove the leading locale segment from the given route segments if present.
 * @param segments - An array of route path segments, where the first segment may be a locale code.
 * @returns A new array of segments with the leading locale segment removed if it matches a known locale code, otherwise returns the original segments.
 */
function removeLocaleSegment(segments: string[]): string[] {
  const isLocalCode = (code: string): code is (typeof localCodes)[number] =>
    localCodes.includes(code as (typeof localCodes)[number]);

  if (segments.length > 0 && isLocalCode(segments[0] ?? "")) {
    return segments.slice(1);
  }
  return segments;
}

/**
 * Check if the given route path is a top-level route and is currently active.
 * @param routePath - The route path to check.
 * @param currentRoutePath - The current route path.
 * @returns True if the route path is a top-level route and is currently active, false otherwise.
 */
export function isTopLevelRouteActive(
  routePath: string,
  currentRoutePath: string
): boolean {
  const currentPath = normalizePath(currentRoutePath);
  const targetPath = normalizePath(routePath);

  let currentSegments = currentPath.split("/");
  let targetSegments = targetPath.split("/");

  // Remove locale segments from both current and target paths.
  currentSegments = removeLocaleSegment(currentSegments);
  targetSegments = removeLocaleSegment(targetSegments);

  return currentSegments[0] === targetSegments[0];
}

/**
 * Removes locale prefixes from route names that follow the pattern "ISO2___restOfRoute".
 * @param routeName - The route name to process, which may contain a locale prefix.
 * @returns The route name without the locale prefix if present, otherwise returns the original route name.
 */
function removeLocaleFromRouteName(routeName: string): string {
  const parts = routeName.split("___");
  const isLocalCode = (code: string): code is (typeof localCodes)[number] =>
    localCodes.includes(code as (typeof localCodes)[number]);

  if (parts.length > 1 && isLocalCode(parts[0] ?? "")) {
    return parts.slice(1).join("___");
  }
  return routeName;
}

/**
 * Determines if the current route path corresponds to a subpage of the given path, excluding certain known subpages like "search" and "create".
 * For example, if the path is "events" and the route name is "en___events-about", this function would return true, indicating that "about" is a subpage of "events".
 * @param path - The base path to check against (e.g., "events").
 * @param routeName - The current route name, which may include locale prefixes and subpage identifiers (e.g., "en___events-about").
 * @returns True if the route name indicates a subpage of the given path that is not "search" or "create", false otherwise.
 */
export function isCurrentRoutePathSubpageOf(path: string, routeName: string) {
  const baseName = removeLocaleFromRouteName(routeName);

  // The first split is to remove the localization path.
  const segments = baseName.split(`${path}-`);
  const subpage = segments.length > 1 ? segments[1] : "";

  // Check that this subpage is valid and not one of the excluded routes.
  return subpage !== "search" && subpage !== "create" && subpage!.length > 0;
}

/**
 * Check if the current route path includes the given path, excluding locale prefixes.
 * @param path - The path to check for inclusion (e.g., "events").
 * @param routeName - The current route name, which may include locale prefixes (e.g., "en___events-about").
 * @returns True if the route name includes the given path, false otherwise.
 */
export function currentRoutePathIncludes(
  path: string,
  routeName: string
): boolean {
  const baseName = removeLocaleFromRouteName(routeName);
  return baseName.includes(path);
}

/**
 * Normalizes Vue Router query parameter to always be an array.
 * Vue Router returns string for single value, array for multiple.
 * LocationQueryValue can be string | null, so we need to handle null.
 * @param arr - Query parameter value (LocationQueryValue | LocationQueryValue[] | undefined)
 * @returns Array of strings, or empty array if undefined/null
 */
export function normalizeArrayFromURLQuery(
  arr: LocationQueryValue | LocationQueryValue[] | undefined
): string[] {
  if (!arr || arr === null) return [];
  if (Array.isArray(arr)) {
    // Filter out null values from array.
    return arr.filter((t): t is string => t !== null && typeof t === "string");
  }
  if (typeof arr === "string") return [arr];
  return [];
}

/**
 * Converts route query to events filter form data.
 * Extracts view separately; normalizes topics to array.
 * @param query - The route query object, which may contain various filter parameters including 'view' and 'topics'.
 * @returns An object containing the filter form data, with 'view' as a separate property and 'topics' normalized to an array of strings.
 */
export function routeQueryToEventsFilterFormData(
  query: Record<string, unknown> | undefined
): Record<string, unknown> {
  const q = query || {};
  const { view, ...rest } = q;
  const topics = normalizeArrayFromURLQuery(
    q.topics as LocationQueryValue | LocationQueryValue[] | undefined
  );
  return { ...rest, topics };
}

/**
 * Converts route query to organization filter form data.
 * Spreads query as-is.
 * @param query - The route query object, which may contain various filter parameters for organization filtering.
 * @returns An object containing the organization filter form data, directly spread from the input query.
 */
export function routeQueryToOrganizationFilterFormData(
  query: Record<string, unknown> | undefined
): Record<string, unknown> {
  return { ...(query || {}) };
}
