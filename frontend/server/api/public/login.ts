import { User } from "#auth-utils";
import { z } from "zod";

const bodySchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse);
  const config = useRuntimeConfig();

  await clearUserSession(event);
  // Docker networking logic: Use internal alias 'backend' if available
  const apiBase = config.apiSecret || config.public.apiBase;
  const base = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;

  // Define endpoints
  const LOGIN_ENDPOINT = `${base}/v1/auth/sign_in`;
  const USER_ENDPOINT = `${base}/v1/auth/sessions`; // <--- CHECK THIS PATH with your Django API

  try {
    // --- Step 1: Login to get Tokens ---
    // We explicitly type the response to know it contains access/refresh
    const tokens = await $fetch<{ access: string; refresh: string }>(
      LOGIN_ENDPOINT,
      {
        method: "POST",
        body: body,
        headers: { "Content-Type": "application/json" },
      }
    );

    // --- Step 2: Use Access Token to get User Profile ---
    const userProfile = await $fetch<{ user: User }>(USER_ENDPOINT, {
      method: "GET",
      headers: {
        Authorization: `Token ${tokens.access}`,
      },
    });

    // --- Step 3: Save EVERYTHING to the Session ---
    await setUserSession(event, {
      // 1. The Public User Data (accessible in Vue templates)
      user: userProfile.user,
      // 2. The Private Tokens (stored in encrypted cookie, not visible to JS)
      secure: {
        token: tokens.access,
        refresh: tokens.refresh,
      },
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
