// SPDX-License-Identifier: AGPL-3.0-or-later
export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();

    const incoming = getRequestURL(event);
    const session = await getUserSession(event);
    // Strip the /api prefix so /api/v1/ -> /v1/.
    const upstreamPath = incoming.pathname.replace(/^\/api\/public/, "") || "/";
    const search = incoming.search || "";

    const apiBase = config.apiSecret || config.public.apiBase;

    const base = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;
    const target = `${base}/v1${upstreamPath}${search}`;
    // Prepare headers object.
    const headers: Record<string, string> = {};

    // If user is logged in, inject the token.
    if (session.secure?.token) {
      headers["Authorization"] = `Token ${session.secure.token}`;
      return proxyRequest(event, target, { headers });
    }

    // If no session token is available, still proxy the request without the Authorization header.
    return proxyRequest(event, target);
  } catch (error) {
    await clearUserSession(event);
    throw createError({
      statusCode: 502,
      statusMessage: "Bad Gateway: Proxy request failed",
    });
  }
});
