// SPDX-License-Identifier: AGPL-3.0-or-later
// Helper to check JWT expiration without external libraries
function isTokenExpired(token: string): boolean {
  try {
    console.log("Checking token expiration for token:", token);
    const payloadBase64 = token.split(".")[1];
    const decodedJson = JSON.parse(
      Buffer.from(payloadBase64, "base64").toString()
    );
    const exp = decodedJson.exp;
    const now = Date.now() / 1000;
    console.log(`Token exp: ${exp}, now: ${now}`, "isExpired:", exp < now);
    // Buffer of 10 seconds to be safe
    return exp < now + 10;
  } catch (e) {
    return true;
  }
}

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  console.log(`[Auth Middleware] Checking auth for ${url.pathname}`);

  // 1. Only run this logic for routes inside /api/auth/
  // We exclude /api/public/ and everything else
  if (!url.pathname.startsWith("/api/auth/")) {
    return;
  }

  // 2. Get the session
  let session = await getUserSession(event);

  // 3. Check if logged in
  if (!session.secure?.token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized: Please log in",
    });
  }

  // 4. Check Expiration & Auto-Refresh
  if (isTokenExpired(session.secure.token)) {
    console.log("Token expired in middleware, attempting refresh...");

    // If we don't have a refresh token, we can't save them.
    if (!session.secure.refresh) {
      await clearUserSession(event);
      throw createError({ statusCode: 401, statusMessage: "Session expired" });
    }

    try {
      const config = useRuntimeConfig();
      const apiBase = config.apiSecret || config.public.apiBase;
      const base = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;

      // Call Django to get a new Access Token
      const newTokens = await $fetch<{ access: string }>(
        `${base}/v1/auth/token/refresh`,
        {
          method: "POST",
          body: { refresh: session.secure.refresh },
        }
      );

      // Update the session with the new token
      await setUserSession(event, {
        ...session,
        secure: {
          ...session.secure,
          token: newTokens.access,
        },
      });

      // Update our local variable so we pass the NEW token to the context
      session.secure.token = newTokens.access;
    } catch (error) {
      console.error("Auto-refresh failed:", error);
      await clearUserSession(event);
      throw createError({
        statusCode: 401,
        statusMessage: "Session expired, please log in again",
      });
    }
  }

  // 5. Attach the VALID token to the event context
  // This makes it easy to access in your API handlers later without re-fetching session
  event.context.auth = {
    token: session.secure.token,
    user: session.user,
  };
});
