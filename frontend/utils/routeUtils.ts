export function isRouteActive(routePath: string): boolean {
    const route = useRoute();
    return route.path.includes(routePath);
}