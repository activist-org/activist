// SPDX-License-Identifier: AGPL-3.0-or-later
/** The event, organization, and group create modals. */

import { c } from "../case.mjs";

export const CREATE_MODAL_FLOWS = [
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
];
