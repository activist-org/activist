// SPDX-License-Identifier: AGPL-3.0-or-later
export default defineEventHandler(async (event) => {
  const path = event.context.params?.path || "";
  const config = useRuntimeConfig();

  // Reconstruct the internal URL:
  // - Input: /media/images/file.png
  // - Target: http://backend:8000/media/images/file.png
  const apiBase = config.apiSecret || config.public.apiBase;

  // Ensure no trailing slash for consistent replacement later.
  const base = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;
  const targetUrl = `${base}/media/images/${path}`;

  // Stream the binary image data.
  return proxyRequest(event, targetUrl);
});
