// SPDX-License-Identifier: AGPL-3.0-or-later
import { z } from "zod";

const bodySchema = z.object({
  email: z.string().email(),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse);
  const config = useRuntimeConfig();

  // Docker networking logic: Use internal alias 'backend' if available
  const apiBase = config.apiSecret || config.public.apiBase;
  const base = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;

  // Define endpoints
  const PW_RESET_ENDPOINT = `${base}/v1/auth/pwreset`;

  try {
    // --- Step 1: Password Reset ---
    await $fetch(PW_RESET_ENDPOINT, {
      method: "POST",
      body: body,
      headers: { "Content-Type": "application/json" },
    });

    return { success: true };
  } catch (error) {
    console.error("Login Process Failed:", error);

    // Check if it was the login or the profile fetch that failed
    const message =
      error.statusCode === 404
        ? "User profile endpoint not found"
        : "Invalid credentials or server error";

    throw createError({
      statusCode: 401,
      statusMessage: message,
    });
  }
});
