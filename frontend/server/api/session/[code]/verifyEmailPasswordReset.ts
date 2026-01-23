// SPDX-License-Identifier: AGPL-3.0-or-later
import { FetchError } from "ofetch";
import { z } from "zod";

const bodySchema = z.object({
  new_password: z.string().min(1),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse);
  const config = useRuntimeConfig();
  const code = getRouterParam(event, "code") as string;

  // Docker networking logic: Use internal alias 'backend' if available.
  const apiBase = config.apiSecret || config.public.apiBase;
  const base = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;

  const VERIFY_EMAIL_PASSWORD_RESET_ENDPOINT = `${base}/v1/auth/verify_email_password/${code}`;

  try {
    await $fetch(VERIFY_EMAIL_PASSWORD_RESET_ENDPOINT, {
      method: "POST",
      body: body,
      headers: { "Content-Type": "application/json" },
    });

    return { success: true };
  } catch (error) {
    // Check if it was the login or the profile fetch that failed.
    if (error instanceof FetchError) {
      const message =
        error.statusCode === 404
          ? "User profile endpoint not found"
          : "Invalid credentials or server error";

      throw createError({
        statusCode: 401,
        statusMessage: message,
      });
    }
  }
});
