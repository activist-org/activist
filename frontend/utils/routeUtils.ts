export function isRouteActive(routePath: string): boolean {
  const route = useRoute();

  // Helper function to remove leading and trailing slashes
  const normalizePath = (path: string) => path.replace(/^\/|\/$/g, '');

  const currentPath = normalizePath(route.path);
  const targetPath = normalizePath(routePath);

  // Handle prefixed routes by ignoring the base path
  // Split paths into segments and compare relative paths
  const currentSegments = currentPath.split('/');
  const targetSegments = targetPath.split('/');

  // Check if the target segments match the corresponding end of current segments
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
