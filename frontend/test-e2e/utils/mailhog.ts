// SPDX-License-Identifier: AGPL-3.0-or-later
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

export function extractConfirmationCode(body: string): string {
  const match = body.match(/\/auth\/confirm\/([a-f0-9-]{36})/);
  if (!match) throw new Error("No confirmation code found in email body");
  return match[1];
}

export function extractPasswordResetCode(body: string): string {
  const match = body.match(/\/auth\/pwreset\/([a-f0-9-]{36})/);
  if (!match) throw new Error("No password reset code found in email body");
  return match[1];
}
