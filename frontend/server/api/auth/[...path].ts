// SPDX-License-Identifier: AGPL-3.0-or-later
export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const session = await getUserSession(event); // get session from cookie

    const incoming = getRequestURL(event);
    // Strip the /api prefix so /api/v1/ -> /v1/.
    const upstreamPath = incoming.pathname.replace(/^\/api\/auth/, "") || "/";
    const search = incoming.search || "";
    const apiBase = config.apiSecret || config.public.apiBase;

    const base = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;
    const target = `${base}/v1${upstreamPath}${search}`;

    // Prepare headers object.
    const headers: Record<string, string> = {};

    // If user is logged in, inject the token.
    if (session.secure?.token) {
      // Check if your Django uses 'Token' or 'Bearer'.
      headers["Authorization"] = `Token ${session.secure.token}`;
    }

    // proxyRequest automatically forwards the original body, method, and query.
    // We just add our custom headers.
    return proxyRequest(event, target, {
      headers: { ...headers, ...event.headers },
    });
  } catch (error) {
    console.error("Proxy Handler Failed:", error);
    throw createError({
      statusCode: 502,
      statusMessage: "Bad Gateway: Proxy request failed",
    });
  }
});
