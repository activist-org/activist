// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from "path";
import head from "./head";
import locales from "./locales";
import modules from "./modules";

export default defineNuxtConfig({
  app: {
    head,
  },
  modules: modules,
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
  content: {
    watch: false,
  },
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
  css: ["reduced-motion/css"],
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
    locales,
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
});
