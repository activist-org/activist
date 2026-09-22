// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Builder for one catalog row.
 *
 * Ids look like EF-PERM-01 (event FAQ, permissions, first case):
 *   EF   = area (see id-prefixes.mjs)
 *   PERM = kind of test (see categories.mjs)
 *   01   = sequence within the flow
 *
 * `spec` is a path fragment (or list of them) that a spec file must contain.
 * Pass `{ title: "regex" }` when one spec file covers more than one case, and
 * `{ required: false }` to keep a row out of the percentage.
 */

export function c(id, category, name, spec, extra = {}) {
  return {
    id,
    category,
    name,
    spec: [].concat(spec),
    required: true,
    ...extra,
  };
}
