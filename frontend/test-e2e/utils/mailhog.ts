// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

const MAILHOG_API = "http://localhost:8025/api/v2";

export interface MailhogEmail {
  subject: string;
  body: string;
  to: string;
}

export async function getLatestEmail(): Promise<MailhogEmail> {
  const response = await fetch(`${MAILHOG_API}/messages?limit=1`);
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
  await fetch(`${MAILHOG_API}/messages`, { method: "DELETE" });
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
  const code = decodeQuotedPrintable(body).match(
    /\/auth\/pwreset\/([a-f0-9-]{36})/
  )?.[1];
  if (!code) throw new Error("No password reset code found in email body");
  return code;
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
    const response = await fetch(`${MAILHOG_API}/messages?limit=1`);
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
