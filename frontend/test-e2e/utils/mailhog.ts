// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

/** Base URL only (no path), e.g. `http://localhost:8025`. Override via `MAILHOG_API_URL` in CI or non-default setups. */
function mailhogApiV2Base(): string {
  const raw = process.env.MAILHOG_API_URL?.replace(/\/$/, "");
  const origin = raw || "http://localhost:8025";
  return `${origin}/api/v2`;
}

export interface MailhogEmail {
  subject: string;
  body: string;
  to: string;
}

export async function getLatestEmail(): Promise<MailhogEmail> {
  const response = await fetch(`${mailhogApiV2Base()}/messages?limit=1`);
  const data = await response.json();
  const latest = data.items?.[0];

  if (!latest) throw new Error("No emails found in Mailhog");

  return {
    subject: latest.Content.Headers.Subject?.[0] ?? "",
    to: latest.Content.Headers.To?.[0] ?? "",
    body: latest.Content.Body,
  };
}

export async function clearEmails(): Promise<void> {
  await fetch(`${mailhogApiV2Base()}/messages`, { method: "DELETE" });
}

function decodeQuotedPrintable(body: string): string {
  return body
    .replace(/=\r?\n/g, "")
    .replace(/=([0-9A-F]{2})/gi, (_, h) =>
      String.fromCharCode(parseInt(h, 16))
    );
}

export function extractConfirmationCode(body: string): string {
  const code = decodeQuotedPrintable(body).match(
    /\/auth\/confirm\/([a-f0-9-]{36})/
  )?.[1];
  if (!code) throw new Error("No confirmation code found in email body");
  return code;
}

export function extractPasswordResetCode(body: string): string {
  const decoded = decodeQuotedPrintable(body);
  // Backend uses `{FRONTEND_URL}/auth/pwreset/{uuid}`; allow optional locale prefix.
  const code = decoded.match(
    /\/(?:[a-z]{2}\/)?auth\/pwreset\/([a-f0-9-]{36})/i
  )?.[1];
  if (!code) throw new Error("No password reset code found in email body");
  return code;
}

const PWRESET_LINK_RE = /\/(?:[a-z]{2}\/)?auth\/pwreset\/[a-f0-9-]{36}/i;

/**
 * Poll Mailhog until a message whose body contains a password-reset link is found.
 * Returns the newest matching message (by Mailhog `Created` timestamp).
 */
export async function findPasswordResetEmail(
  maxAttempts = 40,
  pollIntervalMs = 500
): Promise<MailhogEmail> {
  const base = mailhogApiV2Base();

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await fetch(`${base}/messages?limit=50`);
    const data = await response.json();

    type Item = {
      Content?: {
        Body?: string;
        Headers?: { Subject?: string[]; To?: string[] };
      };
      Created?: string;
    };
    const items = (data.items ?? []) as Item[];
    const matches: { item: Item; t: number }[] = [];

    for (const item of items) {
      const body = item.Content?.Body ?? "";
      const decoded = decodeQuotedPrintable(body);
      if (!PWRESET_LINK_RE.test(decoded)) continue;
      const t = item.Created ? Date.parse(item.Created) : 0;
      matches.push({ item, t: Number.isFinite(t) ? t : 0 });
    }

    if (matches.length > 0) {
      matches.sort((a, b) => b.t - a.t);
      const item = matches[0]!.item;
      return {
        subject: item.Content?.Headers?.Subject?.[0] ?? "",
        to: item.Content?.Headers?.To?.[0] ?? "",
        body: item.Content?.Body ?? "",
      };
    }

    if (attempt < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    }
  }

  throw new Error(
    `No password reset email found in Mailhog after ${maxAttempts} attempts`
  );
}

/**
 * Waits for a password-reset email, then opens the reset form in the browser.
 */
export async function waitAndOpenPasswordResetLink(
  page: Page,
  maxAttempts = 40,
  pollIntervalMs = 500
): Promise<void> {
  const email = await findPasswordResetEmail(maxAttempts, pollIntervalMs);
  const code = extractPasswordResetCode(email.body);
  await page.goto(`/auth/pwreset/${code}`, { waitUntil: "domcontentloaded" });
  await page.waitForURL(/\/auth\/pwreset\/[a-f0-9-]+/i, { timeout: 15000 });
  await page.locator("#reset-password-submit").waitFor({
    state: "visible",
    timeout: 15000,
  });
}

/**
 * Waits for a verification email to arrive in Mailhog, then navigates the
 * Playwright page to the confirmation link from the email body. This exercises
 * the full frontend confirmation flow (auth/confirm/[code].vue → sign-in
 * redirect) rather than calling the backend API directly.
 *
 * @param page - Playwright page object
 * @param maxAttempts - Maximum number of Mailhog polling attempts (default: 10)
 * @param pollIntervalMs - Milliseconds between each poll (default: 500)
 */
export async function waitAndConfirmEmail(
  page: Page,
  maxAttempts = 10,
  pollIntervalMs = 500
): Promise<void> {
  let email: MailhogEmail | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await fetch(`${mailhogApiV2Base()}/messages?limit=1`);
    const data = await response.json();

    if (data.items?.length > 0) {
      const latest = data.items[0];
      email = {
        subject: latest.Content.Headers.Subject?.[0] ?? "",
        to: latest.Content.Headers.To?.[0] ?? "",
        body: latest.Content.Body,
      };
      break;
    }

    if (attempt < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    }
  }

  if (!email) {
    throw new Error(
      `No verification email arrived in Mailhog after ${maxAttempts} attempts`
    );
  }

  const code = extractConfirmationCode(email.body);
  await page.goto(`/auth/confirm/${code}`);
  await page.waitForURL("**/auth/sign-in");
}
