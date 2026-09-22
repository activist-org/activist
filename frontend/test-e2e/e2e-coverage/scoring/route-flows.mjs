// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Route-level view: groups app routes and spec files into flows.
 *
 * Secondary to the scenario catalog. This answers "did anything open this
 * URL", which is why a flow can look covered here and still be missing cases.
 */

export const ROUTE_FLOWS = [
  {
    id: "F01",
    name: "Landing",
    route: (r) => r === "/",
    spec: (p) => p.includes("/landing-page"),
  },
  {
    id: "F02",
    name: "Sign in",
    route: (r) => r === "/auth/sign-in",
    spec: (p) => p.includes("/sign-in"),
  },
  {
    id: "F03",
    name: "Sign up",
    route: (r) => r === "/auth/sign-up",
    spec: (p) => p.includes("/sign-up"),
  },
  {
    id: "F04",
    name: "Password reset",
    route: (r) =>
      r.startsWith("/auth/pwreset") ||
      r === "/auth/reset-password" ||
      r === "/auth/set-password",
    spec: (p) => p.includes("password-reset"),
  },
  {
    id: "F05",
    name: "Email confirm",
    route: (r) => r.startsWith("/auth/confirm"),
    spec: (p) => p.includes("sign-up-authentication"),
  },
  {
    id: "F06",
    name: "Auth hub",
    route: (r) => r === "/auth",
    spec: () => false,
  },
  {
    id: "F07",
    name: "Sign out",
    route: () => false,
    spec: (p) => p.includes("/sign-out"),
  },
  {
    id: "F08",
    name: "Home",
    route: (r) => r === "/home",
    spec: (p) => /\/home-page\.spec\.ts$/.test(p),
  },
  {
    id: "F09",
    name: "Events catalog",
    route: (r) => r === "/events",
    spec: (p) =>
      p.includes("/events-list/") ||
      p.includes("/events-filter") ||
      p.includes("/events-pagination"),
  },
  {
    id: "F10",
    name: "Event about",
    route: (r) => r === "/events/:id/about" || r === "/events/:id",
    spec: (p) => p.includes("/event-about"),
  },
  {
    id: "F11",
    name: "Event FAQ",
    route: (r) => r === "/events/:id/faq",
    spec: (p) => p.includes("/event-faq"),
  },
  {
    id: "F12",
    name: "Event resources",
    route: (r) => r === "/events/:id/resources",
    spec: (p) => p.includes("/event-resources"),
  },
  {
    id: "F13",
    name: "Event create (modal)",
    route: () => false,
    spec: (p) =>
      p.includes("create-flows/event") || p.includes("/events-create/"),
  },
  {
    id: "F14",
    name: "Organizations catalog",
    route: (r) => r === "/organizations",
    spec: (p) =>
      p.includes("/organizations-list/") || p.includes("/organizations-filter"),
  },
  {
    id: "F15",
    name: "Organization about",
    route: (r) =>
      r === "/organizations/:id/about" || r === "/organizations/:id",
    spec: (p) =>
      p.includes("/organization-about") || p.includes("/organization-logo"),
  },
  {
    id: "F16",
    name: "Organization FAQ",
    route: (r) => r === "/organizations/:id/faq",
    spec: (p) => p.includes("/organization-faq") && !p.includes("/groups/"),
  },
  {
    id: "F17",
    name: "Organization resources",
    route: (r) => r === "/organizations/:id/resources",
    spec: (p) =>
      p.includes("/organization-resources") && !p.includes("/groups/"),
  },
  {
    id: "F18",
    name: "Organization events",
    route: (r) => r === "/organizations/:id/events",
    spec: (p) => p.includes("/organization-events"),
  },
  {
    id: "F19",
    name: "Organization groups list",
    route: (r) => r === "/organizations/:id/groups",
    spec: (p) => p.includes("organization-groups-page"),
  },
  {
    id: "F20",
    name: "Organization create (modal)",
    route: () => false,
    spec: (p) =>
      p.includes("create-flows/organization") ||
      p.includes("/organizations-create/"),
  },
  {
    id: "F21",
    name: "Group about",
    route: (r) => r.endsWith("/groups/:id/about") || r.endsWith("/groups/:id"),
    spec: (p) => p.includes("/organization-group-about"),
  },
  {
    id: "F22",
    name: "Group FAQ",
    route: (r) => r.endsWith("/groups/:id/faq"),
    spec: (p) => p.includes("/organization-group-faq"),
  },
  {
    id: "F23",
    name: "Group resources",
    route: (r) => r.endsWith("/groups/:id/resources"),
    spec: (p) => p.includes("/organization-group-resources"),
  },
  {
    id: "F24",
    name: "Group events",
    route: (r) => r.endsWith("/groups/:id/events"),
    spec: (p) => p.includes("/organization-group-events"),
  },
  {
    id: "F25",
    name: "Group create (modal)",
    route: () => false,
    spec: (p) =>
      p.includes("create-flows/group") ||
      p.includes("/organization-group-create/"),
  },
  {
    id: "F26",
    name: "Global search",
    route: (r) => r === "/search" || r.endsWith("/search"),
    spec: (p) => p.includes("/search"),
  },
  {
    id: "F27",
    name: "Global groups catalog",
    route: (r) => r === "/groups",
    spec: () => false,
  },
  {
    id: "F28",
    name: "Contact",
    route: (r) => r === "/contact",
    spec: () => false,
  },
  {
    id: "F29",
    name: "Route query / topics",
    route: () => false,
    spec: (p) => p.includes("route-query-topics"),
  },
  {
    id: "F30",
    name: "Stub subpages",
    route: (_r, rec) => Boolean(rec?.stub),
    spec: () => false,
  },
];

export function flowForSpec(specPath) {
  return ROUTE_FLOWS.find((f) => f.spec(specPath));
}

export function flowStatus(flow, specs, testable, testableCovered, scenarios) {
  if (flow.id === "F30") return "n/a";
  if (specs.length === 0 && testableCovered.length === 0) return "none";
  if (testable.length > 0 && testableCovered.length < testable.length) {
    return "partial";
  }
  if (specs.length === 0) return "covered";
  if (scenarios.length < 2 && specs.length < 3) return "light";
  return "covered";
}
