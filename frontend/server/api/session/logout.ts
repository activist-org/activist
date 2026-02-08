// SPDX-License-Identifier: AGPL-3.0-or-later
import { FetchError } from "ofetch";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  await clearUserSession(event);
  // Docker networking logic: Use internal alias 'backend' if available.
  const apiBase = config.apiSecret || config.public.apiBase;
  const base = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;
  const session = await getUserSession(event);

  const LOG_OUT = `${base}/v1/auth/sign_out`;

  try {
    await $fetch(LOG_OUT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${session?.secure?.token}`,
      },
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
