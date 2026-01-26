// SPDX-License-Identifier: AGPL-3.0-or-later
// Helper to check JWT expiration without external libraries.
function isTokenExpired(token: string): boolean {
  try {
    const payloadBase64 = token.split(".")[1];
    const decodedJson = JSON.parse(
      Buffer.from(payloadBase64, "base64").toString()
    );
    const { exp } = decodedJson;
    const now = Date.now() / 1000;

    // Buffer of 10 seconds to be safe.
    return exp < now + 10;
  } catch {
    return true;
  }
}

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);

  // Only run this logic for routes inside /api/auth/.
  // We exclude /api/public/ and /api/session/ because we want get the token for sensitive services.
  if (!url.pathname.startsWith("/api/auth/")) {
    return;
  }

  const session = await getUserSession(event);

  if (!session.secure?.token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized: Please log in",
    });
  }

  // Check Expiration and Auto-Refresh of the token.
  if (isTokenExpired(session.secure.token)) {
    if (!session.secure.refresh) {
      await clearUserSession(event);
      throw createError({ statusCode: 401, statusMessage: "Session expired" });
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
      throw createError({
        statusCode: 401,
        statusMessage: "Session expired, please log in again",
      });
    }
  }

  // Attach the valid token to the event context.
  event.context.auth = {
    token: session.secure.token,
    user: session.user,
  };
});
