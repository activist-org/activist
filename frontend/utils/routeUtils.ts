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

/**
 * Remove locale prefixes from route names that follow the pattern "locale___restOfTheRoute".
 * For example, "en___organizations" -> "organizations".
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

export function isCurrentRoutePathSubpageOf(path: string, routeName: string): boolean {
  const baseName = removeLocaleFromRouteName(routeName);

  // Split the baseName on `path + '-'` to find a subpage if one exists
  // For example, if path = 'organizations' and routeName = 'organizations-subpage',
  // splitting on 'organizations-' gives ['', 'subpage'].
  const segments = baseName.split(`${path}-`);
  const subpage = segments.length > 1 ? segments[1] : "";

  // Check that this subpage is valid and not one of the excluded routes
  return subpage !== "search" && subpage !== "create" && subpage.length > 0;
}

export function currentRoutePathIncludes(path: string, routeName: string): boolean {
  const baseName = removeLocaleFromRouteName(routeName);
  return baseName.includes(path);
}
