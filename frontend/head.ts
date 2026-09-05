// SPDX-License-Identifier: AGPL-3.0-or-later
// Site origin used for absolute URLs in social-graph meta tags.
// In dev this is `http://localhost:3000` (from VITE_FRONTEND_URL), so link
// previews and crawlers pointed at the local build can resolve every URL.
// In production it defaults to the canonical activist.org domain.
const siteUrl =
  (import.meta.env.VITE_FRONTEND_URL as string | undefined)?.replace(
    /\/+$/,
    ""
  ) || "https://activist.org";

const absolute = (path: string): string =>
  /^https?:\/\//i.test(path)
    ? path
    : `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

export default {
  charset: "utf-8",
  viewport: "width=device-width, initial-scale=1",
  title: "activist",
  htmlAttrs: {
    lang: "en",
  },
  meta: [
    {
      hid: "description",
      name: "description",
      content:
        "A global platform for activism where movements grow and people are inspired join in political actions.",
    },
    {
      hid: "theme-color",
      name: "theme-color",
      content: "#ffffff",
    },
    { property: "og:site_name", content: "activist" },
    { property: "og:locale", content: "en" },
    { hid: "og:type", property: "og:type", content: "website" },
    {
      hid: "og:url",
      property: "og:url",
      content: siteUrl,
    },
    {
      hid: "og:title",
      property: "og:title",
      content: "activist",
    },
    {
      hid: "og:description",
      property: "og:description",
      content: "Open-source activism platform.",
    },
    {
      hid: "og:image",
      property: "og:image",
      content: absolute("/images/activist/activistOpenGraphImage.png"),
    },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:type", content: "image/png" },
    {
      hid: "og:image:secure_url",
      property: "og:image:secure_url",
      content: absolute("/images/activist/activistOpenGraphImage.png"),
    },
    {
      hid: "og:image:alt",
      property: "og:image:alt",
      content:
        "activist — a global platform for activism where movements grow and people are inspired to join in political action.",
    },
    { name: "twitter:site", content: "@activist_org" },
    { name: "twitter:card", content: "summary_large_image" },
    {
      hid: "twitter:url",
      name: "twitter:url",
      content: siteUrl,
    },
    {
      hid: "twitter:title",
      name: "twitter:title",
      content: "activist",
    },
    {
      hid: "twitter:description",
      name: "twitter:description",
      content: "Open-source activism platform.",
    },
    {
      hid: "twitter:image",
      name: "twitter:image",
      content: absolute("/images/activist/activistTwitterOpenGraphImage.png"),
    },
    {
      hid: "twitter:image:alt",
      name: "twitter:image:alt",
      content:
        "activist — a global platform for activism where movements grow and people are inspired to join in political action.",
    },
    // For OpenStreetMap via MapLibre.
    { name: "referrer", content: "strict-origin-when-cross-origin" },
  ],
  link: [
    { rel: "icon", type: "image/x-icon", href: "/icons/favicons/favicon.ico" },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/icons/favicons/favicon-16x16.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/icons/favicons/favicon-32x32.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/icons/favicons/favicon-apple-touch.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "192x192",
      href: "/icons/favicons/android-chrome-192x192.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "512x512",
      href: "/icons/favicons/android-chrome-512x512.png",
    },
    {
      hid: "canonical",
      rel: "canonical",
      href: siteUrl,
    },
  ],
};
