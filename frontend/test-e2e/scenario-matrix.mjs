// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Required E2E scenarios. Scored by `e2e-coverage.mjs --full`.
 *
 * Case ids look like EF-PERM-01:
 *   EF   = area (see ID_PREFIXES)
 *   PERM = kind of test (see CATEGORIES)
 *   01   = sequence in that flow
 *
 * Add a case with c("ID", "CAT", "what to prove", "spec-file-stem").
 * Pass { title: "regex" } when one spec file covers more than one case.
 * Then run: node test-e2e/scripts/e2e-coverage.mjs --full --markdown
 */

function c(id, category, name, spec, extra = {}) {
  return {
    id,
    category,
    name,
    spec: [].concat(spec),
    required: true,
    ...extra,
  };
}

export const ID_PREFIXES = {
  L: "Landing",
  A: "Authentication",
  H: "Home",
  E: "Events catalog",
  EA: "Event about",
  EF: "Event FAQ",
  ER: "Event resources",
  EC: "Event create (modal)",
  O: "Organizations catalog",
  OA: "Organization about",
  OF: "Organization FAQ",
  OR: "Organization resources",
  OE: "Organization events",
  OG: "Organization groups list",
  OC: "Organization create (modal)",
  GA: "Group about",
  GF: "Group FAQ",
  GR: "Group resources",
  GE: "Group events",
  GC: "Group create (modal)",
  S: "Global search",
  GG: "Global groups catalog",
  C: "Contact",
  T: "Route query / topics",
};

export const CATEGORIES = {
  DISP: "Page loads, content visible",
  NAV: "Tabs, sidebar, deep links, step navigation",
  CRUD: "Create, update, delete happy path",
  VAL: "Form validation, inline errors",
  PERM: "Role-based UI (admin / member / unauth / other)",
  EMPTY: "Empty state copy and actions",
  ERR: "API 4xx/5xx, network, rate limit",
  A11Y: "axe scan in scope",
  AUTH: "Unauthenticated redirect or hidden controls",
  INT: "Share, QR, reorder/DnD, filters, pagination",
  UI: "Modal open/close, show/hide, shortcuts",
  HAPPY: "End-to-end success path",
};

export const SCENARIO_FLOWS = [
  {
    id: "F01",
    name: "Landing",
    cases: [
      c(
        "L-DISP-01",
        "DISP",
        "Page title and hero visible",
        "landing-page/landing-page.spec"
      ),
      c("L-NAV-01", "NAV", "Navigate to Events", "landing-page"),
      c("L-NAV-02", "NAV", "Navigate to Organizations", "landing-page"),
      c(
        "L-NAV-03",
        "NAV",
        "Sign In / Sign Up CTAs",
        "landing-page-hero-navigation"
      ),
      c(
        "L-NAV-04",
        "NAV",
        "Learn More sections",
        "landing-page-hero-navigation"
      ),
      c("L-INT-01", "INT", "Footer links", "landing-page-features-cta"),
      c("L-INT-02", "INT", "Social link counts", "landing-page-features-cta"),
      c("L-INT-03", "INT", "Theme toggle", "landing-page-hero-navigation"),
      c("L-INT-04", "INT", "Language selector", "landing-page-hero-navigation"),
      c("L-A11Y-01", "A11Y", "Landing axe scan", "landing-page-accessibility"),
    ],
  },
  {
    id: "F02",
    name: "Sign in",
    cases: [
      c("A-VAL-01", "VAL", "Empty/invalid credentials", "sign-in-validation"),
      c(
        "A-HAPPY-01",
        "HAPPY",
        "Sign in to home + cookie",
        "sign-in-authentication"
      ),
      c(
        "A-ERR-01",
        "ERR",
        "401 / 429 / network failure",
        "sign-in-server-errors"
      ),
      c("A-UI-01", "UI", "Show/hide password", "sign-in", {
        title: "show and hide password",
      }),
      c("A-A11Y-01", "A11Y", "Sign-in axe", "sign-in", { title: "accessib" }),
    ],
  },
  {
    id: "F03",
    name: "Sign up",
    cases: [
      c(
        "A-VAL-02",
        "VAL",
        "Password strength / mismatch / captcha",
        "sign-up-validation"
      ),
      c(
        "A-HAPPY-02",
        "HAPPY",
        "Sign up, confirm email, sign in",
        "sign-up-authentication"
      ),
    ],
  },
  {
    id: "F04",
    name: "Password reset",
    cases: [
      c("A-VAL-05", "VAL", "Invalid email on reset request", "password-reset"),
      c(
        "A-HAPPY-03",
        "HAPPY",
        "Password reset end-to-end",
        "password-reset-authentication"
      ),
      c("A-DISP-04", "DISP", "/auth/reset-password form", "password-reset"),
      c("A-DISP-03", "DISP", "/auth/set-password form", "set-password"),
    ],
  },
  {
    id: "F05",
    name: "Email confirm",
    cases: [
      c(
        "A-DISP-02",
        "DISP",
        "/auth/confirm/email standalone UX",
        "confirm/email"
      ),
    ],
  },
  {
    id: "F07",
    name: "Sign out",
    cases: [c("A-HAPPY-04", "HAPPY", "Sign out", "sign-out-validation")],
  },
  {
    id: "F08",
    name: "Home & shell",
    cases: [
      c("H-DISP-01", "DISP", "Home loads for authed user", "home-page.spec"),
      c("H-INT-01", "INT", "Topics filter expand/collapse", "all/home-page"),
      c(
        "H-INT-02",
        "INT",
        "Search modal shortcut",
        ["desktop/home-page", "home-page"],
        {
          title: "search|CTRL|shortcut",
        }
      ),
      c("H-NAV-01", "NAV", "Nav to Events / Organizations", "home-page"),
      c("H-A11Y-01", "A11Y", "Home axe", "home-page", { title: "accessib" }),
      c("H-INT-04", "INT", "Search returns results / navigates", "search"),
      c("H-INT-05", "INT", "Home topics persist in URL", "home-page", {
        title: "topic",
      }),
    ],
  },
  {
    id: "F09",
    name: "Events catalog",
    cases: [
      c("E-DISP-01", "DISP", "Events page loads", "events-home-page"),
      c("E-DISP-02", "DISP", "Navigate to event about", "events-home-page"),
      c(
        "E-INT-01",
        "INT",
        "View types: list / map / calendar",
        "events-filter"
      ),
      c("E-INT-02", "INT", "Sidebar filters", "events-filter"),
      c("E-INT-04", "INT", "Pagination / infinite scroll", "events-pagination"),
      c(
        "E-EMPTY-01",
        "EMPTY",
        "API failure empty catalog",
        "events-list-api-errors"
      ),
      c(
        "E-EMPTY-02",
        "EMPTY",
        "Filtered query empty / non-empty",
        "events-list-empty-filtered"
      ),
      c("E-A11Y-01", "A11Y", "Events list axe", "events-home-page", {
        title: "accessib",
      }),
      c("E-NAV-01", "NAV", "/events/search page", "events/search"),
    ],
  },
  {
    id: "F10",
    name: "Event about",
    cases: [
      c("EA-DISP-01", "DISP", "About page loads", "event-about"),
      c(
        "EA-CRUD-01",
        "CRUD",
        "Edit About / Get Involved",
        "event-about-content"
      ),
      c(
        "EA-PERM-01",
        "PERM",
        "4-role edit icon matrix",
        "event-about-permissions"
      ),
      c("EA-INT-01", "INT", "Social links CRUD", "event-about-social-links"),
      c("EA-INT-02", "INT", "QR open/close/download", "event-about-qr-code"),
      c("EA-INT-03", "INT", "Share event page", "event-about-accessibility"),
      c("EA-ERR-01", "ERR", "404 / 403 / 500", "event-about-api-errors"),
      c("EA-A11Y-01", "A11Y", "About axe", "event-about-accessibility"),
      c(
        "EA-NAV-01",
        "NAV",
        "Desktop section tabs",
        "desktop/events/event-about"
      ),
    ],
  },
  {
    id: "F11",
    name: "Event FAQ",
    cases: [
      c("EF-DISP-01", "DISP", "FAQ page loads", "event-faq-page"),
      c("EF-CRUD-01", "CRUD", "Full FAQ CRUD happy path", "event-faq-page", {
        title: "CREATE|UPDATE|DELETE|manage FAQ",
      }),
      c(
        "EF-PERM-01",
        "PERM",
        "4-role new/edit/delete visibility",
        "event-faq-permissions"
      ),
      c(
        "EF-EMPTY-01",
        "EMPTY",
        "Admin / non-admin empty states",
        "event-faq-empty-states"
      ),
      c(
        "EF-ERR-01",
        "ERR",
        "Create 500, delete 403, rate limit",
        "event-faq-server-errors"
      ),
      c(
        "EF-INT-02",
        "INT",
        "Keyboard focus + arrow reorder",
        "faq-keyboard-navigation"
      ),
      c(
        "EF-INT-03",
        "INT",
        "Drag reorder (desktop)",
        "desktop/events/event-faq",
        {
          title: "drag|reorder",
        }
      ),
      c(
        "EF-INT-04",
        "INT",
        "Drag reorder (mobile)",
        "mobile/events/event-faq",
        {
          title: "drag|reorder",
        }
      ),
      c("EF-A11Y-01", "A11Y", "FAQ axe", "event-faq-page", {
        title: "accessib",
      }),
    ],
  },
  {
    id: "F12",
    name: "Event resources",
    cases: [
      c("ER-DISP-01", "DISP", "Resources page loads", "event-resources-page"),
      c("ER-CRUD-01", "CRUD", "Create resource happy path", "event-resources", {
        title: "create resource|CREATE, UPDATE, DELETE|manage resource",
      }),
      c("ER-CRUD-02", "CRUD", "Edit resource", "event-resources", {
        title: "edit resource|update resource|CREATE, UPDATE, DELETE",
      }),
      c("ER-CRUD-03", "CRUD", "Delete resource", "event-resources", {
        title: "delete resource|CREATE, UPDATE, DELETE",
      }),
      c(
        "ER-PERM-01",
        "PERM",
        "4-role button visibility",
        "event-resources-permissions"
      ),
      c(
        "ER-EMPTY-01",
        "EMPTY",
        "Admin / non-admin empty states",
        "event-resources-empty-states"
      ),
      c(
        "ER-ERR-01",
        "ERR",
        "Create 500, delete 403, rate limit",
        "event-resources-server-errors"
      ),
      c(
        "ER-INT-02",
        "INT",
        "Drag reorder desktop",
        "desktop/events/event-resources",
        {
          title: "drag|reorder",
        }
      ),
      c(
        "ER-INT-03",
        "INT",
        "Drag reorder mobile",
        "mobile/events/event-resources",
        {
          title: "drag|reorder",
        }
      ),
      c("ER-A11Y-01", "A11Y", "Resources axe", "event-resources-page", {
        title: "accessib",
      }),
    ],
  },
  {
    id: "F13",
    name: "Event create (modal)",
    cases: [
      c(
        "EC-VAL-01",
        "VAL",
        "Form validation (details / time / orgs)",
        "events-create-form-validation"
      ),
      c(
        "EC-VAL-02",
        "VAL",
        "Location step validation",
        "events-create-location-step"
      ),
      c(
        "EC-HAPPY-01",
        "HAPPY",
        "Complete create flow",
        "create-flows/event-create-modal"
      ),
      c("EC-A11Y-01", "A11Y", "Create modal axe", "event-create-modal", {
        title: "accessib",
      }),
      c("EC-UI-01", "UI", "Open / close modal", "event-create-modal"),
    ],
  },
  {
    id: "F14",
    name: "Organizations catalog",
    cases: [
      c("O-DISP-01", "DISP", "Orgs page loads", "organizations-home-page"),
      c("O-INT-01", "INT", "Share org page", "organizations-home-page", {
        title: "share",
      }),
      c(
        "O-EMPTY-01",
        "EMPTY",
        "City filter empty / non-empty",
        "organizations-list-empty-filtered"
      ),
      c("O-A11Y-01", "A11Y", "Orgs axe", "organizations-home-page", {
        title: "accessib",
      }),
      c(
        "O-INT-02",
        "INT",
        "Topic / multi-filter sidebar",
        "organizations-filter"
      ),
      c(
        "O-INT-04",
        "INT",
        "Pagination / infinite scroll",
        "organizations-pagination"
      ),
      c(
        "O-ERR-01",
        "ERR",
        "API failure toast",
        "organizations-list-api-errors"
      ),
    ],
  },
  {
    id: "F15",
    name: "Organization about",
    cases: [
      c("OA-DISP-01", "DISP", "About loads", "organization-about"),
      c("OA-CRUD-01", "CRUD", "Edit About", "organization-about-content"),
      c(
        "OA-CRUD-02",
        "CRUD",
        "Image upload",
        "organization-about-image-upload"
      ),
      c(
        "OA-INT-01",
        "INT",
        "Social links CRUD",
        "organization-about-social-links"
      ),
      c("OA-INT-02", "INT", "QR via menu", "organization-about-qr-code"),
      c("OA-A11Y-01", "A11Y", "About axe", "organization-about-accessibility"),
      c("OA-NAV-01", "NAV", "Section tabs desktop/mobile", [
        "desktop/organizations/organization-about",
        "mobile/organizations/organization-about",
      ]),
      c(
        "OA-PERM-01",
        "PERM",
        "4-role edit matrix",
        "organization-about-permissions"
      ),
    ],
  },
  {
    id: "F16",
    name: "Organization FAQ",
    cases: [
      c("OF-DISP-01", "DISP", "FAQ loads", "organization-faq-page"),
      c("OF-CRUD-01", "CRUD", "Full CRUD", "organization-faq-page", {
        title: "CREATE|UPDATE|DELETE|manage FAQ",
      }),
      c("OF-ERR-01", "ERR", "Server errors", "organization-faq-server-errors"),
      c("OF-INT-01", "INT", "DnD desktop/mobile", [
        "desktop/organizations/organization-faq",
        "mobile/organizations/organization-faq",
      ]),
      c("OF-PERM-01", "PERM", "4-role matrix", "organization-faq-permissions"),
      c(
        "OF-EMPTY-01",
        "EMPTY",
        "Empty states",
        "organization-faq-empty-states"
      ),
      c("OF-INT-02", "INT", "Keyboard navigation", "organization-faq-keyboard"),
    ],
  },
  {
    id: "F17",
    name: "Organization resources",
    cases: [
      c("OR-DISP-01", "DISP", "Resources load", "organization-resources-page"),
      c(
        "OR-CRUD-01",
        "CRUD",
        "Create/edit/delete happy path",
        "organization-resources",
        {
          title: "CREATE, UPDATE, DELETE|manage resource|create resource",
        }
      ),
      c(
        "OR-ERR-01",
        "ERR",
        "Server errors",
        "organization-resources-server-errors"
      ),
      c("OR-INT-01", "INT", "Share + DnD", [
        "desktop/organizations/organization-resources",
        "mobile/organizations/organization-resources",
      ]),
      c(
        "OR-PERM-01",
        "PERM",
        "Permissions matrix",
        "organization-resources-permissions"
      ),
      c(
        "OR-EMPTY-01",
        "EMPTY",
        "Empty states",
        "organization-resources-empty-states"
      ),
    ],
  },
  {
    id: "F18",
    name: "Organization events",
    cases: [
      c(
        "OE-DISP-01",
        "DISP",
        "Events tab loads",
        "organization-events-display"
      ),
      c("OE-INT-01", "INT", "Navigate to event", "organization-events-display"),
      c(
        "OE-INT-02",
        "INT",
        "Open create event modal",
        "organization-events-interactions"
      ),
    ],
  },
  {
    id: "F19",
    name: "Organization groups list",
    cases: [
      c("OG-DISP-01", "DISP", "Groups tab loads", "organization-groups-page"),
    ],
  },
  {
    id: "F20",
    name: "Organization create (modal)",
    cases: [
      c(
        "OC-VAL-01",
        "VAL",
        "Form validation",
        "organizations-create-form-validation"
      ),
      c(
        "OC-HAPPY-01",
        "HAPPY",
        "Complete create flow",
        "create-flows/organization-create-modal"
      ),
      c("OC-A11Y-01", "A11Y", "Create modal axe", "organization-create-modal", {
        title: "accessib",
      }),
    ],
  },
  {
    id: "F21",
    name: "Group about",
    cases: [
      c("GA-DISP-01", "DISP", "About loads", "organization-group-about"),
      c("GA-CRUD-01", "CRUD", "Edit About", "organization-group-about-content"),
      c(
        "GA-NAV-01",
        "NAV",
        "Group subpage navigation",
        "organization-group-about-navigation"
      ),
      c(
        "GA-PERM-01",
        "PERM",
        "4-role edit matrix",
        "organization-group-about-permissions"
      ),
    ],
  },
  {
    id: "F22",
    name: "Group FAQ",
    cases: [
      c("GF-DISP-01", "DISP", "FAQ loads", "organization-group-faq-display"),
      c(
        "GF-CRUD-01",
        "CRUD",
        "Full FAQ management",
        "organization-group-faq-management"
      ),
      c(
        "GF-EMPTY-01",
        "EMPTY",
        "Empty states",
        "organization-group-faq-empty-states"
      ),
      c(
        "GF-ERR-01",
        "ERR",
        "Server errors",
        "organization-group-faq-server-errors"
      ),
      c(
        "GF-VAL-01",
        "VAL",
        "Form validation",
        "organization-group-faq-form-validation"
      ),
      c("GF-INT-01", "INT", "DnD desktop/mobile", [
        "desktop/organizations/groups/organization-group-faq",
        "mobile/organizations/groups/organization-group-faq",
      ]),
      c(
        "GF-PERM-01",
        "PERM",
        "4-role matrix",
        "organization-group-faq-permissions"
      ),
    ],
  },
  {
    id: "F23",
    name: "Group resources",
    cases: [
      c("GR-DISP-01", "DISP", "Resources load", "organization-group-resources"),
      c(
        "GR-CRUD-01",
        "CRUD",
        "Management / delete happy path",
        "organization-group-resources-management"
      ),
      c(
        "GR-EMPTY-01",
        "EMPTY",
        "Empty states",
        "organization-group-resources-empty-states"
      ),
      c(
        "GR-ERR-01",
        "ERR",
        "Server errors",
        "organization-group-resources-server-errors"
      ),
      c(
        "GR-VAL-01",
        "VAL",
        "Form validation",
        "organization-group-resources-form-validation"
      ),
      c("GR-INT-01", "INT", "DnD desktop/mobile", [
        "desktop/organizations/groups/organization-group-resources",
        "mobile/organizations/groups/organization-group-resources",
      ]),
      c(
        "GR-PERM-01",
        "PERM",
        "Permissions matrix",
        "organization-group-resources-permissions"
      ),
    ],
  },
  {
    id: "F24",
    name: "Group events",
    cases: [
      c(
        "GE-DISP-01",
        "DISP",
        "Events tab loads",
        "organization-group-events-page"
      ),
    ],
  },
  {
    id: "F25",
    name: "Group create (modal)",
    cases: [
      c(
        "GC-VAL-01",
        "VAL",
        "Form validation",
        "organization-group-create-form-validation"
      ),
      c(
        "GC-HAPPY-01",
        "HAPPY",
        "Complete create flow",
        "create-flows/group-create-modal"
      ),
      c("GC-A11Y-01", "A11Y", "Create modal axe", "group-create-modal", {
        title: "accessib",
      }),
    ],
  },
  {
    id: "F26",
    name: "Global search",
    cases: [
      c("S-DISP-01", "DISP", "Search page loads", [
        "specs/all/search",
        "specs/desktop/search",
        "specs/mobile/search",
      ]),
      c("S-INT-01", "INT", "Query, results, navigate", "search.spec"),
    ],
  },
  {
    id: "F27",
    name: "Global groups catalog",
    cases: [
      c("GG-DISP-01", "DISP", "/groups catalog loads", "specs/all/groups"),
    ],
  },
  {
    id: "F28",
    name: "Contact",
    cases: [
      c("C-DISP-01", "DISP", "Contact page loads", "contact"),
      c("C-VAL-01", "VAL", "Contact form validation", "contact"),
    ],
  },
  {
    id: "F29",
    name: "Route query / topics",
    cases: [
      c(
        "T-INT-01",
        "INT",
        "Topic(s) persist in events URL",
        "route-query-topics-stability"
      ),
      c(
        "T-INT-03",
        "INT",
        "Home topics URL persistence",
        "route-query-topics-stability",
        {
          title: "home",
        }
      ),
    ],
  },
];
