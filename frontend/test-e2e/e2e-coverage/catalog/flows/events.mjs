// SPDX-License-Identifier: AGPL-3.0-or-later
/** Events catalog and event subpages. The create modal is in create-modals.mjs. */

import { c } from "../case.mjs";

export const EVENT_FLOWS = [
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
      // The create happy path lives in the validation spec: it fills valid
      // input, submits, and asserts the new card. Point at it directly so the
      // server-error specs in this folder cannot stand in for a success path.
      c(
        "ER-CRUD-01",
        "CRUD",
        "Create resource happy path",
        "event-resources-form-validation",
        {
          title: "correcting all errors submits the form",
        }
      ),
      c("ER-CRUD-02", "CRUD", "Edit resource", "event-resources", {
        title: "edit resource|update resource|CREATE, UPDATE, DELETE",
      }),
      // Excludes the server-errors spec so the delete 403 test cannot satisfy
      // a success path. No spec deletes a resource yet.
      c("ER-CRUD-03", "CRUD", "Delete resource", "event-resources-page", {
        title: "delete",
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
];
