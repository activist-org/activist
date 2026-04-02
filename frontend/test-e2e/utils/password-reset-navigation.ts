// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * True when the URL is an allowed post-submit landing after requesting a password-reset email.
 * Matches `/`, locale-only roots (e.g. `/en`), and `/home` — `pages/auth/pwreset/email.vue` uses `push("/")`, not `/home`.
 */
export function isPostPasswordRequestLanding(url: string): boolean {
  let path: string;
  try {
    path = new URL(url).pathname.replace(/\/$/, "") || "/";
  } catch {
    return false;
  }
  if (path === "" || path === "/") return true;
  if (path.endsWith("/home")) return true;
  if (/^\/[a-z]{2}(-[A-Z]{2})?$/i.test(path)) return true;
  return false;
}
