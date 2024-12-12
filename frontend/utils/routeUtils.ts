import locales from "~/locales";

const localCodes = locales.map((l) => l.code);

/**
 * Normalize a given path by removing leading and trailing slashes.
 */
function normalizePath(path: string): string {
  return path.replace(/^\/|\/$/g, "");
}

/**
 * Remove the leading locale segment from the given route segments if present.
 * For example, ['en', 'organizations'] -> ['organizations'].
 */
function removeLocaleSegment(segments: string[]): string[] {
  if (segments.length > 0 && localCodes.includes(segments[0])) {
    return segments.slice(1);
  }
  return segments;
}

export function isRouteActive(routePath: string): boolean {
  const route = useRoute();

  const currentPath = normalizePath(route.path);
  const targetPath = normalizePath(routePath);

  let currentSegments = currentPath.split("/");
  let targetSegments = targetPath.split("/");

  // Remove locale segments from both current and target paths.
  currentSegments = removeLocaleSegment(currentSegments);
  targetSegments = removeLocaleSegment(targetSegments);

  // If current route is shorter than the target, it cannot match.
  if (currentSegments.length < targetSegments.length) {
    return false;
  }

  // Check if the target segments match the end of the current segments.
  return targetSegments.every(
    (segment, index) =>
      currentSegments[
        currentSegments.length - targetSegments.length + index
      ] === segment
  );
}

export function isTopLevelRouteActive(routePath: string): boolean {
  const route = useRoute();

  const currentPath = normalizePath(route.path);
  const targetPath = normalizePath(routePath);

  let currentSegments = currentPath.split("/");
  let targetSegments = targetPath.split("/");

  // Remove locale segments from both current and target paths.
  currentSegments = removeLocaleSegment(currentSegments);
  targetSegments = removeLocaleSegment(targetSegments);

  console.log(`currentSegments: ${currentSegments}`);
  console.log(`targetSegments: ${targetSegments}`);

  return currentSegments[0] === targetSegments[0];
}

/**
 * Helper: Removes locale prefixes from route names that follow the pattern
 * "locale___restOfTheRoute". For ex. "en___organizations" -> "organizations".
 */
function removeLocaleFromRouteName(routeName: string): string {
  const LOCALES = ['en', 'fr', 'de'];
  const parts = routeName.split('___');
  if (parts.length > 1 && LOCALES.includes(parts[0])) {
    return parts.slice(1).join('___');
  }
  return routeName;
}

export function isCurrentRoutePathSubpageOf(path: string, routeName: string) {
  const baseName = removeLocaleFromRouteName(routeName);

  // The first split is to remove the localization path.
  const segments = baseName.split(`${path}-`);
  const subpage = segments.length > 1 ? segments[1] : "";

  // Check that this subpage is valid and not one of the excluded routes
  return subpage !== "search" && subpage !== "create" && subpage.length > 0;
}

export function currentRoutePathIncludes(path: string, routeName: string): boolean {
  const baseName = removeLocaleFromRouteName(routeName);
  return baseName.includes(path);
}
