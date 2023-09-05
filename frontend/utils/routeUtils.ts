export function isRouteActive(routePath: string): boolean {
  const route = useRoute();
  return route.path.split("/")[2] === routePath.substring(1, routePath.length);
}
