// SPDX-License-Identifier: AGPL-3.0-or-later
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const code = getRouterParam(event, "code") as string;
  // Docker networking logic: Use internal alias 'backend' if available
  const apiBase = config.apiSecret || config.public.apiBase;
  const base = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;

  // Define endpoints
  const VERIFY_EMAIL_SIGN_UP_ENDPOINT = `${base}/v1/auth/verify_email/${code}`;

  try {
    // --- Step 1: Sign Up ---
    await $fetch(VERIFY_EMAIL_SIGN_UP_ENDPOINT, {
      method: "POST",
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
