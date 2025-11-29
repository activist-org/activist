// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LocationQueryValue } from "vue-router";

import locales from "#shared/utils/locales";

const localCodes = locales.map((l) => l.code);

/**
 * Normalize a given path by removing leading and trailing slashes.
 */
function normalizePath(path: string): string {
  return path.replace(/^\/+/g, "").replace(/\/+$/g, "");
}

/**
 * Remove the leading locale segment from the given route segments if present.
 */
function removeLocaleSegment(segments: string[]): string[] {
  const isLocalCode = (code: string): code is (typeof localCodes)[number] =>
    localCodes.includes(code as (typeof localCodes)[number]);

  if (segments.length > 0 && isLocalCode(segments[0] ?? "")) {
    return segments.slice(1);
  }
  return segments;
}

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

export function isCurrentRoutePathSubpageOf(path: string, routeName: string) {
  const baseName = removeLocaleFromRouteName(routeName);

  // The first split is to remove the localization path.
  const segments = baseName.split(`${path}-`);
  const subpage = segments.length > 1 ? segments[1] : "";

  // Check that this subpage is valid and not one of the excluded routes.
  return subpage !== "search" && subpage !== "create" && subpage!.length > 0;
}

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
 *
 * @param arr - Query parameter value (LocationQueryValue | LocationQueryValue[] | undefined)
 * @returns Array of strings, or empty array if undefined/null
 */
export function normalizeArrayFromURLQuery(
  arr: LocationQueryValue | LocationQueryValue[] | undefined
): string[] {
  if (!arr || arr === null) return [];
  if (Array.isArray(arr)) {
    // Filter out null values from array
    return arr.filter((t): t is string => t !== null && typeof t === "string");
  }
  if (typeof arr === "string") return [arr];
  return [];
}
