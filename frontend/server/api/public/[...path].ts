// SPDX-License-Identifier: AGPL-3.0-or-later
export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();

    const incoming = getRequestURL(event);
    // Strip the /api prefix so /api/v1/ -> /v1/.
    const upstreamPath = incoming.pathname.replace(/^\/api\/public/, "") || "/";
    const search = incoming.search || "";

    const apiBase = config.apiSecret || config.public.apiBase;

    const base = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;
    const target = `${base}/v1${upstreamPath}${search}`;

    // proxyRequest preserves method, headers, body and supports streaming/SSE.
    return proxyRequest(event, target);
  } catch (error) {
    throw createError({
      statusCode: 502,
      statusMessage: "Bad Gateway: Proxy request failed",
    });
  }
});
