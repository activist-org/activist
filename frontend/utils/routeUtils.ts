export function isRouteActive(routePath: string): boolean {
  const route = useRoute();
  return route.path.split("/")[2] === routePath.substring(1, routePath.length);
}

export function isCurrentRoutePathSubpageOf(path: string, routeName: string) {
  // Remove the localization part of the route name if it exists.
  let routeNameToCheck = routeName;
  routeNameToCheck = routeNameToCheck.split("__")[0];

  const segments = routeNameToCheck.split(path + "-");
  const subpage = segments.length > 1 ? segments[1] : "";
  return subpage !== "search" && subpage !== "create" && subpage.length > 0;
}

export function currentRoutePathIncludes(
  path: string,
  routeName: string
): boolean {
  return routeName.includes(path);
}
