// SPDX-License-Identifier: AGPL-3.0-or-later
// Helper to check JWT expiration without external libraries.

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  const isAuthRoute = url.pathname.startsWith("/api/auth/");
  const isPublicRoute = url.pathname.startsWith("/api/public/");

  // Session routes manage tokens themselves; nothing to inject.
  if (!isAuthRoute && !isPublicRoute) {
    return;
  }

  const session = await getUserSession(event);

  // No token: auth routes reject, public routes pass through anonymously.
  if (!session.secure?.token) {
    if (isAuthRoute) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized: Please log in",
      });
    }
    return;
  }

  // Check Expiration and Auto-Refresh of the token.
  if (isTokenExpired(session.secure.token)) {
    if (!session.secure.refresh) {
      await clearUserSession(event);
      if (isAuthRoute) {
        throw createError({
          statusCode: 401,
          statusMessage: "Session expired, please log in again",
        });
      }
      // Public route: session silently cleared, request proceeds anonymously.
      return;
    }

    try {
      const config = useRuntimeConfig();
      const apiBase = config.apiSecret || config.public.apiBase;
      const base = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;

      // Call Django to get a new Access Token.
      const newTokens = await $fetch<{ access: string }>(
        `${base}/v1/auth/token/refresh`,
        {
          method: "POST",
          body: { refresh: session.secure.refresh },
        }
      );

      // Update the session with the new token.
      await setUserSession(event, {
        ...session,
        secure: {
          ...session.secure,
          token: newTokens.access,
        },
      });

      // Update our local variable so we pass the NEW token to the context.
      session.secure.token = newTokens.access;
    } catch {
      await clearUserSession(event);
      if (isAuthRoute) {
        throw createError({
          statusCode: 401,
          statusMessage: "Session expired, please log in again",
        });
      }
      // Public route: refresh failed → anonymous fallback.
      return;
    }
  }

  // Attach the valid token to the event context.
  event.context.auth = {
    token: session.secure.token,
    user: session.user,
  };
});
