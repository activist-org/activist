// SPDX-License-Identifier: AGPL-3.0-or-later

import fs from "fs";

/** Host-only or registrable-ish forms seen in Playwright exports. */
function isLoopbackCookieDomain(domainRaw: unknown): boolean {
  if (typeof domainRaw !== "string" || domainRaw.length === 0) return false;

  const host = domainRaw.replace(/^\./, "").toLowerCase();
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".localhost") ||
    host.endsWith(".127.0.0.1")
  );
}

export function normalizeAuthStorageLoopbackSecureCookies(
  authFilePath: string
): void {
  if (!fs.existsSync(authFilePath)) return;

  let rawJson: unknown;
  try {
    rawJson = JSON.parse(fs.readFileSync(authFilePath, "utf-8"));
  } catch {
    return;
  }

  if (
    typeof rawJson !== "object" ||
    rawJson === null ||
    !Array.isArray((rawJson as { cookies?: unknown }).cookies)
  ) {
    return;
  }

  const payload = rawJson as {
    cookies: Array<Record<string, unknown>>;
  };

  let changed = false;
  payload.cookies = payload.cookies.map((c) => {
    if (!isLoopbackCookieDomain(c.domain) || c.secure !== true) {
      return c;
    }
    changed = true;
    return { ...c, secure: false };
  });

  if (changed) {
    fs.writeFileSync(
      authFilePath,
      `${JSON.stringify(rawJson, null, 2)}\n`,
      "utf-8"
    );
  }
}
