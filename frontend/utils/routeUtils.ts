// A helper array for supported locales. Adjust as needed.
const LOCALES = ['en', 'fr', 'de'];

/**
 * Removes leading and trailing slashes from a path.
 */
function normalizePath(path: string): string {
  return path.replace(/^\/|\/$/g, '');
}

/**
 * If the first segment of the given segments is a known locale, remove it.
 */
function removeLocaleSegment(segments: string[]): string[] {
  if (segments.length > 0 && LOCALES.includes(segments[0])) {
    return segments.slice(1);
  }
  return segments;
}

/**
 * Remove locale prefix from a routeName if it follows the pattern like `en___something`.
 * If there's no locale segment, this function returns the routeName unchanged.
 */
function removeLocaleFromRouteName(routeName: string): string {
  const parts = routeName.split('___');
  if (parts.length > 1 && LOCALES.includes(parts[0])) {
    return parts.slice(1).join('___');
  }
  return routeName;
}

export function isRouteActive(routePath: string): boolean {
  const route = useRoute();

  const currentPath = normalizePath(route.path);
  const targetPath = normalizePath(routePath);

  let currentSegments = currentPath.split('/');
  let targetSegments = targetPath.split('/');

  // Remove locale segments from both current and target paths
  currentSegments = removeLocaleSegment(currentSegments);
  targetSegments = removeLocaleSegment(targetSegments);

  // Check if the target segments match the corresponding ending segments of the current path
  return targetSegments.every(
    (segment, index) =>
      currentSegments[currentSegments.length - targetSegments.length + index] === segment
  );
}

export function isCurrentRoutePathSubpageOf(path: string, routeName: string): boolean {
  // Remove locale info from the routeName first
  const baseName = removeLocaleFromRouteName(routeName);

  // After removing locale, we expect something like "projects-subpage"
  // Splitting by `path + '-'` should isolate the subpage if it exists
  const segments = baseName.split(`${path}-`);
  const subpage = segments.length > 1 ? segments[1] : "";

  // Check that the subpage is neither "search" nor "create" and that it has some length
  return subpage !== "search" && subpage !== "create" && subpage.length > 0;
}

export function currentRoutePathIncludes(path: string, routeName: string): boolean {
  // Remove locale info from the routeName
  const baseName = removeLocaleFromRouteName(routeName);

  // Check if the cleaned route name includes the given path
  return baseName.includes(path);
}
