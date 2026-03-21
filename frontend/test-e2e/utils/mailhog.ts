// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

/** Base URL only (no path), e.g. `http://localhost:8025`. Override via `MAILHOG_API_URL` in CI or non-default setups. */
function mailhogApiV2Base(): string {
  const raw = process.env.MAILHOG_API_URL?.replace(/\/$/, "");
  const origin = raw || "http://localhost:8025";
  return `${origin}/api/v2`;
}

type MailhogMessageItem = {
  Content?: {
    Body?: string;
    Headers?: { Subject?: string[]; To?: string[] };
  };
  Created?: string;
};

function itemToEmail(item: MailhogMessageItem): MailhogEmail {
  return {
    subject: item.Content?.Headers?.Subject?.[0] ?? "",
    to: item.Content?.Headers?.To?.[0] ?? "",
    body: item.Content?.Body ?? "",
  };
}

async function fetchMailhogMessages(
  limit: number
): Promise<MailhogMessageItem[]> {
  const response = await fetch(
    `${mailhogApiV2Base()}/messages?limit=${limit}`
  );
  const data = await response.json();
  return (data.items ?? []) as MailhogMessageItem[];
}

async function sleepMs(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Polls Mailhog until `select` returns a value, or throws after `maxAttempts`.
 */
async function pollMailhogUntil<T>(options: {
  limit: number;
  maxAttempts: number;
  pollIntervalMs: number;
  select: (items: MailhogMessageItem[]) => T | undefined;
  errorMessage: (maxAttempts: number) => string;
}): Promise<T> {
  const { limit, maxAttempts, pollIntervalMs, select, errorMessage } = options;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const items = await fetchMailhogMessages(limit);
    const chosen = select(items);
    if (chosen !== undefined) return chosen;
    if (attempt < maxAttempts) await sleepMs(pollIntervalMs);
  }

  throw new Error(errorMessage(maxAttempts));
}

export interface MailhogEmail {
  subject: string;
  body: string;
  to: string;
}

export async function getLatestEmail(): Promise<MailhogEmail> {
  const items = await fetchMailhogMessages(1);
  if (items.length === 0) throw new Error("No emails found in Mailhog");
  return itemToEmail(items[0]!);
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

function newestPasswordResetEmail(
  items: MailhogMessageItem[]
): MailhogEmail | undefined {
  let best: { item: MailhogMessageItem; t: number } | null = null;

  for (const item of items) {
    const body = item.Content?.Body ?? "";
    const decoded = decodeQuotedPrintable(body);
    if (!PWRESET_LINK_RE.test(decoded)) continue;
    const t = item.Created ? Date.parse(item.Created) : 0;
    const ts = Number.isFinite(t) ? t : 0;
    if (!best || ts > best.t) best = { item, t: ts };
  }

  return best ? itemToEmail(best.item) : undefined;
}

/**
 * Poll Mailhog until a message whose body contains a password-reset link is found.
 * Returns the newest matching message (by Mailhog `Created` timestamp).
 */
export async function findPasswordResetEmail(
  maxAttempts = 40,
  pollIntervalMs = 500
): Promise<MailhogEmail> {
  return pollMailhogUntil({
    limit: 50,
    maxAttempts,
    pollIntervalMs,
    select: newestPasswordResetEmail,
    errorMessage: (n) =>
      `No password reset email found in Mailhog after ${n} attempts`,
  });
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
  const email = await pollMailhogUntil({
    limit: 1,
    maxAttempts,
    pollIntervalMs,
    select: (items) =>
      items.length > 0 ? itemToEmail(items[0]!) : undefined,
    errorMessage: (n) =>
      `No verification email arrived in Mailhog after ${n} attempts`,
  });

  const code = extractConfirmationCode(email.body);
  await page.goto(`/auth/confirm/${code}`);
  await page.waitForURL("**/auth/sign-in");
}
