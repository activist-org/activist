// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * The required E2E scenarios, scored by `../scoring`.
 *
 * To add a behavior, add one `c(...)` row to the matching file in `flows/`.
 * See FRONTEND_TESTING.md (Checking E2E coverage) for a walkthrough.
 */

import { CREATE_MODAL_FLOWS } from "./flows/create-modals.mjs";
import { EVENT_FLOWS } from "./flows/events.mjs";
import { GLOBAL_FLOWS } from "./flows/global.mjs";
import { GROUP_FLOWS } from "./flows/groups.mjs";
import { LANDING_AUTH_FLOWS } from "./flows/landing-auth.mjs";
import { ORGANIZATION_FLOWS } from "./flows/organizations.mjs";

export { CATEGORIES } from "./categories.mjs";
export { ID_PREFIXES } from "./id-prefixes.mjs";

/** Sorted by flow id so the report order does not depend on how flows are grouped into files. */
export const SCENARIO_FLOWS = [
  ...LANDING_AUTH_FLOWS,
  ...EVENT_FLOWS,
  ...CREATE_MODAL_FLOWS,
  ...ORGANIZATION_FLOWS,
  ...GROUP_FLOWS,
  ...GLOBAL_FLOWS,
].sort((a, b) => a.id.localeCompare(b.id));
