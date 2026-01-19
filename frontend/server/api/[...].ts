export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const incoming = getRequestURL(event);
  // Strip the /api prefix so /api/v1/... -> /v1/...
  const upstreamPath = incoming.pathname.replace(/^\/api/, "") || "/";
  const search = incoming.search || "";

  const base = config.apiBase.endsWith("/")
    ? config.apiBase.slice(0, -1)
    : config.apiBase;
  const target = `${base}${upstreamPath}${search}`;

  // proxyRequest preserves method, headers, body and supports streaming/SSE
  return proxyRequest(event, target);
});
