// SPDX-License-Identifier: AGPL-3.0-or-later
/** Middle part of a case id: what kind of test it is. */

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
