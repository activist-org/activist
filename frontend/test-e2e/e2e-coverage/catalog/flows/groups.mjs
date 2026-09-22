// SPDX-License-Identifier: AGPL-3.0-or-later
/** Organization group subpages. */

import { c } from "../case.mjs";

export const GROUP_FLOWS = [
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
      // Role-based UI on group surfaces is still in development, so the PERM
      // rows below stay in the catalog but out of the percentage.
      c(
        "GA-PERM-01",
        "PERM",
        "4-role edit matrix",
        "organization-group-about-permissions",
        { required: false }
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
        "organization-group-faq-permissions",
        { required: false }
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
        "Full resource CRUD happy path",
        "organization-group-resources-management",
        {
          title: "manage resources",
        }
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
        "organization-group-resources-permissions",
        { required: false }
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
];
