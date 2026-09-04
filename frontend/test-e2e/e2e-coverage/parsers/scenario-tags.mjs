// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Coarse tags inferred from spec paths and test titles. These describe what a
 * spec looks like; the catalog under `../catalog` is what we score against.
 */

const SCENARIOS = [
  { id: "a11y", label: "accessibility", re: /accessib|a11y|\baxe\b/i },
  { id: "val", label: "validation", re: /validat|required field|invalid/i },
  { id: "empty", label: "empty states", re: /empty/i },
  {
    id: "err",
    label: "API / server errors",
    re: /server.error|api.error|network error|rate.?limit/i,
  },
  {
    id: "perm",
    label: "permissions",
    re: /permission|unauthor|forbidden|\brole\b|\badmin\b|\bguest\b/i,
  },
  {
    id: "auth",
    label: "authentication",
    re: /sign.in|sign.up|sign.out|password.reset|confirm email/i,
  },
  {
    id: "crud",
    label: "create / edit / delete",
    re: /\bcreate\b|\bupdate\b|\bedit\b|\bdelete\b|\breorder\b|\bdrag\b/i,
  },
  {
    id: "int",
    label: "filters / share / QR",
    re: /filter|paginat|share|\bqr\b|social|subscribe|topic/i,
  },
];

export function scenariosFor(text) {
  return SCENARIOS.filter((s) => s.re.test(text)).map((s) => s.id);
}
