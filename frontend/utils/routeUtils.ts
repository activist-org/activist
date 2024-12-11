export function isRouteActive(routePath: string): boolean {
  const route = useRoute();
  // TODO: Needs to account for prefixed routes as well.
  return route.path.split("/")[1] === routePath.substring(1, routePath.length);
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
  // The first split is to remove the localization path.
  const segments = routeName.split("___")[0].split(path + "-");
  const subpage = segments.length > 1 ? segments[1] : "";
  return subpage !== "search" && subpage !== "create" && subpage.length > 0;
}

export function currentRoutePathIncludes(path: string, routeName: string): boolean {
  const baseName = removeLocaleFromRouteName(routeName);
  return baseName.includes(path);
}
