// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

let mailhogApiV2BaseCached: string | undefined;

// Base URL only (no path), e.g. `http://localhost:8025`.
// Override via `MAILHOG_API_URL` in CI or non-default setups.
function mailhogApiV2Base(): string {
  if (mailhogApiV2BaseCached !== undefined) return mailhogApiV2BaseCached;
  const raw = process.env.MAILHOG_API_URL?.replace(/\/$/, "");
  const origin = raw || "http://localhost:8025";
  mailhogApiV2BaseCached = `${origin}/api/v2`;
  return mailhogApiV2BaseCached;
}

// First N sleeps between empty polls use a short interval; then `pollIntervalMs`.
const POLL_FAST_SLEEPS = 4;
const POLL_FAST_MS = 150;

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
  const response = await fetch(`${mailhogApiV2Base()}/messages?limit=${limit}`);
  const data = await response.json();
  return (data.items ?? []) as MailhogMessageItem[];
}

async function sleepMs(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Polls Mailhog until `select` returns a value, or throws after `maxAttempts`.
 * Uses short gaps for the first few empty polls, then `pollIntervalMs`.
 */
async function pollMailhogUntil<T>(options: {
  limit: number;
  maxAttempts: number;
  pollIntervalMs: number;
  select: (items: MailhogMessageItem[]) => T | undefined;
  errorMessage: (maxAttempts: number) => string;
}): Promise<T> {
  const { limit, maxAttempts, pollIntervalMs, select, errorMessage } = options;

  let sleepCount = 0;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const items = await fetchMailhogMessages(limit);
    const chosen = select(items);
    if (chosen !== undefined) return chosen;
    if (attempt < maxAttempts) {
      sleepCount++;
      await sleepMs(
        sleepCount <= POLL_FAST_SLEEPS ? POLL_FAST_MS : pollIntervalMs
      );
    }
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

export function extractConfirmationCodeFromDecoded(
  decodedBody: string
): string {
  const code = decodedBody.match(/\/auth\/confirm\/([a-f0-9-]{36})/i)?.[1];
  if (!code) throw new Error("No confirmation code found in email body");
  return code;
}

export function extractConfirmationCode(body: string): string {
  return extractConfirmationCodeFromDecoded(decodeQuotedPrintable(body));
}

export function extractPasswordResetCodeFromDecoded(
  decodedBody: string
): string {
  const code = decodedBody.match(
    /\/(?:[a-z]{2}\/)?auth\/pwreset\/([a-f0-9-]{36})/i
  )?.[1];
  if (!code) throw new Error("No password reset code found in email body");
  return code;
}

export function extractPasswordResetCode(body: string): string {
  return extractPasswordResetCodeFromDecoded(decodeQuotedPrintable(body));
}

const PWRESET_LINK_RE = /\/(?:[a-z]{2}\/)?auth\/pwreset\/[a-f0-9-]{36}/i;
const CONFIRM_LINK_RE = /\/auth\/confirm\/[a-f0-9-]{36}/i;

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

function newestConfirmationEmail(
  items: MailhogMessageItem[]
): MailhogEmail | undefined {
  let best: { item: MailhogMessageItem; t: number } | null = null;

  for (const item of items) {
    const body = item.Content?.Body ?? "";
    const decoded = decodeQuotedPrintable(body);
    if (!CONFIRM_LINK_RE.test(decoded)) continue;
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
  const decoded = decodeQuotedPrintable(email.body);
  const code = extractPasswordResetCodeFromDecoded(decoded);
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
 * Scans recent messages (`limit=50`) and picks the newest whose body contains
 * an `/auth/confirm/{uuid}` link so the correct mail is chosen when Mailhog
 * holds multiple messages.
 *
 * @param page - Playwright page object
 * @param maxAttempts - Maximum number of Mailhog polling attempts (default: 10)
 * @param pollIntervalMs - Milliseconds between each poll after fast polls (default: 500)
 */
export async function waitAndConfirmEmail(
  page: Page,
  maxAttempts = 10,
  pollIntervalMs = 500
): Promise<void> {
  const email = await pollMailhogUntil({
    limit: 50,
    maxAttempts,
    pollIntervalMs,
    select: newestConfirmationEmail,
    errorMessage: (n) =>
      `No verification email arrived in Mailhog after ${n} attempts`,
  });

  const decoded = decodeQuotedPrintable(email.body);
  const code = extractConfirmationCodeFromDecoded(decoded);
  await page.goto(`/auth/confirm/${code}`);
  await page.waitForURL("**/auth/sign-in");
}
