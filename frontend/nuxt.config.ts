// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from "path";
export default defineNuxtConfig({
  ssr: false,
  typescript: {
    // strict: true,
    // typeCheck: true,
  },
  devtools: {
    enabled: true,
  },
  alias: {
    "@": resolve(__dirname, "./"),
  },
  plugins: ["~/plugins/i18n-head.ts"],
  modules: [
    "@nuxt/content",
    "nuxt-icon",
    [
      "nuxt-mail",
      {
        message: {
          to: "team@activist.org",
        },
        smtp: {
          host: "smtp.activist.org",
          port: 587,
        },
      },
    ],
    "@nuxtjs/color-mode",
    "@nuxtjs/device",
    "@nuxt/devtools",
    "@nuxtjs/i18n",
    "@nuxtjs/plausible",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@vueuse/nuxt",
  ],
  imports: {
    dirs: ["./stores"],
  },
  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
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
    vueI18n: "./i18n.config.ts",
    locales: [
      {
        code: "en",
        iso: "en-US",
        name: "English",
        file: "en-US.json",
        isCatchallLocale: true,
      },
      {
        code: "de",
        iso: "de",
        name: "Deutsch",
        file: "de.json",
      },
      {
        code: "es",
        iso: "es",
        name: "Español",
        file: "es.json",
      },
      {
        code: "fr",
        iso: "fr",
        name: "Français",
        file: "fr.json",
      },
      {
        code: "it",
        iso: "it",
        name: "Italiano",
        file: "it.json",
      },
      {
        code: "pt",
        iso: "pt",
        name: "Português",
        file: "pt.json",
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
  vue: {
    compilerOptions: {
      isCustomElement: (tag) =>
        ["swiper-slide", "swiper-container"].includes(tag),
    },
  },
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "activist",
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "A global platform for activism where movements grow and people are inspired join in political actions.",
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
          content: "Open-source activism platform.",
        },
        {
          hid: "og:image",
          property: "og:image",
          content: "/images/activistOpenGraphImage.png",
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
          content: "Open-source activism platform.",
        },
        {
          hid: "twitter:image",
          name: "twitter:image",
          content: "/images/activistTwitterOpenGraphImage.png",
        },
      ],
      link: [
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "favicons/favicon.svg",
        },
        {
          rel: "icon",
          type: "image/png",
          href: "favicons/faviconLight.png",
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
