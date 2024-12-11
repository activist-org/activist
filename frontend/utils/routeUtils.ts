
// Define the supported locales. Adjust as needed to match your project.
const LOCALES = ['en', 'fr', 'de'];

/**
 * Normalize a given path by removing leading and trailing slashes.
 */
function normalizePath(path: string): string {
  return path.replace(/^\/|\/$/g, '');
}


/**
 * Remove the leading locale segment from the given route segments if present.
 * For example, ['en', 'organizations'] -> ['organizations'].
 */
function removeLocaleSegment(segments: string[]): string[] {
  if (segments.length > 0 && LOCALES.includes(segments[0])) {
    return segments.slice(1);
  }
  return segments;
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

  // If current route is shorter than the target, it cannot match
  if (currentSegments.length < targetSegments.length) {
    return false;
  }

  // Check if the target segments match the end of the current segments
  return targetSegments.every(
    (segment, index) =>
      currentSegments[currentSegments.length - targetSegments.length + index] === segment
  );
}

export function isCurrentRoutePathSubpageOf(path: string, routeName: string) {
  // The first split is to remove the localization path.
  const segments = routeName.split("___")[0].split(path + "-");
  const subpage = segments.length > 1 ? segments[1] : "";
  return subpage !== "search" && subpage !== "create" && subpage.length > 0;
}

export function currentRoutePathIncludes(
  path: string,
  routeName: string
): boolean {
  return routeName.includes(path);
}
