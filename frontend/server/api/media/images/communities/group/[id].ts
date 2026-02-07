// SPDX-License-Identifier: AGPL-3.0-or-later
export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();

    // 1. Construct the Target URL dynamically (like your proxy)
    const incoming = getRequestURL(event);

    // Adjust this regex if you want to match a different prefix, e.g. /api/images
    const upstreamPath = incoming.pathname.replace(/^\/api\/media\/images/, "") || "/";
    const search = incoming.search || "";

    const apiBase = config.apiSecret || config.public.apiBase;

    // Ensure no trailing slash for consistent replacement later
    const base = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;

    // Construct the backend URL
    const target = `${base}/v1${upstreamPath}${search}/images`;

    // 2. Fetch the data (instead of proxyRequest) so we can modify it
    const backendData = await $fetch(target, {
      headers: getRequestHeaders(event) as HeadersInit
    });

    // 3. Define the transformation
    const transformUrl = (internalUrl: string) => {
      if (!internalUrl) return internalUrl;
      // Replaces 'http://backend:8000' with empty string (making it relative)
      return internalUrl.replace(base, '');
    }

    // 4. Map and Transform
    if (Array.isArray(backendData)) {
      return backendData.map((item: any) => ({
        ...item,
        fileObject: transformUrl(item.fileObject)
      }));
    }

    return backendData;

  } catch (error: any) {
    throw createError({
      statusCode: error?.response?.status || 502,
      statusMessage: error?.response?.statusText || "Bad Gateway",
      data: error?.data
    });
  }
});
