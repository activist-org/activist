// SPDX-License-Identifier: AGPL-3.0-or-later
import type { User } from "#auth-utils";

import { FetchError } from "ofetch";
import { z } from "zod";

const bodySchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse);
  const config = useRuntimeConfig();

  await clearUserSession(event);
  // Docker networking logic: Use internal alias 'backend' if available.
  const apiBase = config.apiSecret || config.public.apiBase;
  const base = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;

  const LOGIN_ENDPOINT = `${base}/v1/auth/sign_in`;
  const USER_ENDPOINT = `${base}/v1/auth/sessions`;

  try {
    // We explicitly type the response to know it contains access/refresh.
    const tokens = await $fetch<{ access: string; refresh: string }>(
      LOGIN_ENDPOINT,
      {
        method: "POST",
        body: body,
        headers: { "Content-Type": "application/json" },
      }
    );

    // Use Access Token to get the user profile.
    const userProfile = await $fetch<{ user: User }>(USER_ENDPOINT, {
      method: "GET",
      headers: {
        Authorization: `Token ${tokens.access}`,
      },
    });

    await setUserSession(event, {
      // The public user data (accessible in Vue templates).
      user: userProfile.user,
      // The private tokens (stored in encrypted cookie, not visible to web frontend).
      secure: {
        token: tokens.access,
        refresh: tokens.refresh,
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
