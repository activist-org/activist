// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  plugins: [],
  modules: [
    "@nuxt/content",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "nuxt-icon",
  ],
  imports: {
    dirs: ["./stores"],
  },
  colorMode: {
    classSuffix: "",
  },
  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
    configPath: "tailwind.config.ts",
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  i18n: {
    strategy: "prefix",
    lazy: true,
    baseUrl: "https://activist.org",
    langDir: "i18n",
    locales: [
      {
        code: "en",
        iso: "en-US",
        name: "English (US)",
        file: "en-US.json",
        isCatchallLocale: true,
      },
      {
        code: "de",
        iso: "de-DE",
        name: "Deutsch (DE)",
        file: "de-DE.json",
      },
      {
        code: "fr",
        iso: "fr-FR",
        name: "Français (FR)",
        file: "fr-FR.json",
      },
    ],
    defaultLocale: "en",
    customRoutes: "config",
    pages: {
      // about: {
      //   de: "/ueber-uns",
      //   fr: "/a-propos",
      // },
    },
    vueI18n: {
      legacy: false,
      locale: "en",
      fallbackLocale: "en",
    },
    detectBrowserLanguage: {
      useCookie: false,
      redirectOn: "root",
    },
  },
  components: [
    {
      path: "~/components",
      global: true,
    },
  ],
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "activist",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Open-source, nonprofit activism platform.",
        },
        { property: "og:site_name", content: "activist" },
        { hid: "og:type", property: "og:type", content: "website" },
        {
          hid: "og:url",
          property: "og:url",
          content: "https://activist.org",
        },
        {
          hid: "og:title",
          property: "og:title",
          content: "activist",
        },
        {
          hid: "og:description",
          property: "og:description",
          content: "Open-source, nonprofit activism platform.",
        },
        {
          hid: "og:image",
          property: "og:image",
          content: "/images/activistOGImage.png",
        },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },

        { name: "twitter:site", content: "@activist_org" },
        { name: "twitter:card", content: "summary_large_image" },
        {
          hid: "twitter:url",
          name: "twitter:url",
          content: "https://activist.org",
        },
        {
          hid: "twitter:title",
          name: "twitter:title",
          content: "activist",
        },
        {
          hid: "twitter:description",
          name: "twitter:description",
          content: "Open-source, nonprofit activism platform.",
        },
        {
          hid: "twitter:image",
          name: "twitter:image",
          content: "/images/activistTwitterOGImage.png",
        },
      ],
      link: [
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/favicon.svg",
        },
        {
          hid: "canonical",
          rel: "canonical",
          href: "https://activist.org",
        },
      ],
    },
  },
});
