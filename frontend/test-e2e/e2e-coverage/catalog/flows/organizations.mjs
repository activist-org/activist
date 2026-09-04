// SPDX-License-Identifier: AGPL-3.0-or-later
/** Organizations catalog and organization subpages. */

import { c } from "../case.mjs";

export const ORGANIZATION_FLOWS = [
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
      // Role-based UI on org and group surfaces is still in development, so the
      // PERM rows below stay in the catalog but out of the percentage.
      c(
        "OA-PERM-01",
        "PERM",
        "4-role edit matrix",
        "organization-about-permissions",
        { required: false }
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
      c("OF-PERM-01", "PERM", "4-role matrix", "organization-faq-permissions", {
        required: false,
      }),
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
      // Only create is tested on this surface: edit and delete have no spec.
      c(
        "OR-CRUD-01",
        "CRUD",
        "Create resource happy path",
        "organization-resources-form-validation",
        {
          title: "correcting all errors submits the form",
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
        "organization-resources-permissions",
        { required: false }
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
];
