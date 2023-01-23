// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  plugins: [],
  modules: [
    "@nuxt/content",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "nuxt-icon",
    "@nuxtjs/i18n",
  ],
  colorMode: {
    classSuffix: "",
  },
  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
    configPath: "tailwind.config.ts",
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
      about: {
        de: "/ueber-uns",
        fr: "/a-propos",
      },
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
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "activist",
      link: [
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/favicon.svg",
        },
      ],
      meta: [
        {
          name: "activist",
          content: "An open-source, nonprofit political activism network.",
        },
      ],
    },
  },
});
