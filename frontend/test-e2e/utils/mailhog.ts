// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Page } from "@playwright/test";

let mailhogApiV2BaseCached: string | undefined;

// Base URL only (no path), e.g. `http://localhost:8025`.
// Override via `MAILHOG_API_URL` in CI or non-default setups.
/**
 * Returns the base URL for Mailhog API v2, using the `MAILHOG_API_URL` environment variable if set, or defaulting to `http://localhost:8025/api/v2`. The result is cached after the first call for efficiency.
 * @returns The base URL for Mailhog API v2
 */
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

/**
 * Converts a Mailhog API message item to a simpler MailhogEmail object.
 * @param item - The MailhogMessageItem to convert
 * @returns A MailhogEmail object containing the subject, recipient, and body of the email
 */
function itemToEmail(item: MailhogMessageItem): MailhogEmail {
  return {
    subject: item.Content?.Headers?.Subject?.[0] ?? "",
    to: item.Content?.Headers?.To?.[0] ?? "",
    body: item.Content?.Body ?? "",
  };
}

/**
 * Fetches messages from Mailhog API with a specified limit.
 * @param limit - The maximum number of messages to fetch from Mailhog
 * @returns A promise that resolves to an array of MailhogMessageItem objects
 */
async function fetchMailhogMessages(
  limit: number
): Promise<MailhogMessageItem[]> {
  const response = await fetch(`${mailhogApiV2Base()}/messages?limit=${limit}`);
  const data = await response.json();
  return (data.items ?? []) as MailhogMessageItem[];
}

/**
 * Sleeps for a specified number of milliseconds.
 * @param ms - The number of milliseconds to sleep
 * @returns A promise that resolves after the specified time has elapsed
 */
async function sleepMs(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Polls Mailhog until `select` returns a value, or throws after `maxAttempts`.
 * Uses short gaps for the first few empty polls, then `pollIntervalMs`.
 * @param options - Configuration options for polling Mailhog
 * @param options.limit - The number of recent messages to fetch on each poll
 * @param options.maxAttempts - The maximum number of polling attempts before giving up
 * @param options.pollIntervalMs - The interval in milliseconds between polls after the initial fast polls
 * @param options.select - A function that selects a desired message from the fetched items, returning it or undefined
 * @param options.errorMessage - A function that generates an error message if the desired message is not found after max attempts
 * @returns A promise that resolves to the selected message of type T
 * @throws {Error} if the desired message is not found after the specified number of attempts
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

/**
 * Fetches the latest email from Mailhog and converts it to a MailhogEmail object.
 * @returns A promise that resolves to the latest MailhogEmail object
 * @throws {Error} if no emails are found in Mailhog
 */
export async function getLatestEmail(): Promise<MailhogEmail> {
  const items = await fetchMailhogMessages(1);
  if (items.length === 0) throw new Error("No emails found in Mailhog");
  return itemToEmail(items[0]!);
}

/**
 * Deletes all messages from Mailhog to ensure a clean state for tests.
 * @returns A promise that resolves when the delete operation is complete
 * @throws {Error} if the delete operation fails
 */
export async function clearEmails(): Promise<void> {
  await fetch(`${mailhogApiV2Base()}/messages`, { method: "DELETE" });
}

/**
 * Decodes a quoted-printable encoded email body, which is commonly used by Mailhog.
 * @param body - The quoted-printable encoded email body to decode
 * @returns The decoded email body as a string
 */
function decodeQuotedPrintable(body: string): string {
  return body
    .replace(/=\r?\n/g, "")
    .replace(/=([0-9A-F]{2})/gi, (_, h) =>
      String.fromCharCode(parseInt(h, 16))
    );
}

/**
 * Extracts the confirmation code from a decoded email body.
 * @param decodedBody - The decoded email body
 * @returns The extracted confirmation code
 * @throws {Error} if no confirmation code is found
 */
export function extractConfirmationCodeFromDecoded(
  decodedBody: string
): string {
  const code = decodedBody.match(/\/auth\/confirm\/([a-f0-9-]{36})/i)?.[1];
  if (!code) throw new Error("No confirmation code found in email body");
  return code;
}

/**
 * Extracts the confirmation code from a quoted-printable encoded email body.
 * @param body - The quoted-printable encoded email body
 * @returns The extracted confirmation code
 * @throws {Error} if no confirmation code is found
 */
export function extractConfirmationCode(body: string): string {
  return extractConfirmationCodeFromDecoded(decodeQuotedPrintable(body));
}

/**
 * Extracts the password reset code from a decoded email body.
 * @param decodedBody - The decoded email body
 * @returns The extracted password reset code
 * @throws {Error} if no password reset code is found
 */
export function extractPasswordResetCodeFromDecoded(
  decodedBody: string
): string {
  const code = decodedBody.match(
    /\/(?:[a-z]{2}\/)?auth\/pwreset\/([a-f0-9-]{36})/i
  )?.[1];
  if (!code) throw new Error("No password reset code found in email body");
  return code;
}

/**
 * Extracts the password reset code from a quoted-printable encoded email body.
 * @param body - The quoted-printable encoded email body
 * @returns The extracted password reset code
 * @throws {Error} if no password reset code is found
 */
export function extractPasswordResetCode(body: string): string {
  return extractPasswordResetCodeFromDecoded(decodeQuotedPrintable(body));
}

const PWRESET_LINK_RE = /\/(?:[a-z]{2}\/)?auth\/pwreset\/[a-f0-9-]{36}/i;
const CONFIRM_LINK_RE = /\/auth\/confirm\/[a-f0-9-]{36}/i;

/**
 * Finds the newest email in Mailhog that contains a password reset link in its body.
 * @param items - An array of MailhogMessageItem objects to search through
 * @returns A MailhogEmail object representing the newest email with a password reset link, or undefined if no such email is found
 */
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
 * Finds the newest email in Mailhog that contains a confirmation link in its body.
 * @param items - An array of MailhogMessageItem objects to search through
 * @returns A MailhogEmail object representing the newest email with a confirmation link, or undefined if no such email is found
 */
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
 * @param maxAttempts - Maximum number of Mailhog polling attempts (default: 40)
 * @param pollIntervalMs - Milliseconds between each poll after fast polls (default: 500)
 * @returns A promise that resolves to a MailhogEmail object representing the found password reset email
 * @throws {Error} if no password reset email is found after the specified number of attempts
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
 * @param page - Playwright page object
 * @param maxAttempts - Maximum number of Mailhog polling attempts (default: 40)
 * @param pollIntervalMs - Milliseconds between each poll after fast polls (default: 500)
 * @returns A promise that resolves when the password reset page has loaded and the submit button is visible
 * @throws {Error} if no password reset email is found after the specified number of attempts, or if the page fails to load properly
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
 * @param page - Playwright page object
 * @param maxAttempts - Maximum number of Mailhog polling attempts (default: 10)
 * @param pollIntervalMs - Milliseconds between each poll after fast polls (default: 500)
 * @returns A promise that resolves when the confirmation process is complete and the sign-in page is loaded
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
