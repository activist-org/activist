// SPDX-License-Identifier: AGPL-3.0-or-later
// https://nuxt.com/docs/api/configuration/nuxt-config
import type { NuxtPage } from "nuxt/schema";

import { resolve } from "path";

import applyMiddleware from "./applyMiddleware";
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
    watch: { enabled: false },
  },

  imports: {
    dirs: ["./stores"],
  },

  vite: {
    server: {
      watch: {
        usePolling: true,
        ignored: [
          "**/playwright/**",
          "**/playwright-report/**",
          "**/test/**",
          "**/test-e2e/**",
          "**/test-results/**",
          "**/frontend/test-results/**",
          "**/frontend/test-results/accessibility-results/**",
        ],
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
    lazy: true,
    strategy: "prefix_and_default",
    langDir: "./i18n",
    vueI18n: "./i18n.config.ts",
    baseUrl: "https://activist.org",
    locales,
    defaultLocale: "en",
    customRoutes: "config",
    pages: {},
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

  hooks: {
    "pages:extend": (pages: NuxtPage[]) => {
      applyMiddleware(pages);
    },
    "app:resolve": (app) => {
      console.log("App instance resolved:", app);
    },
  },

  nitro: {
    preset: "netlify-static",
  },

  plausible: {
    // Prevent tracking on localhost.
    ignoredHostnames: ["localhost"],
  },

  security: {
    // Cross-Origin Resource Sharing (CORS) not needed for frontend.
    corsHandler: false,
    headers: {
      contentSecurityPolicy: {
        "img-src": [
          "'self'",
          "data:",
          "blob:",
          import.meta.env.VITE_BACKEND_URL || "",
        ],
        /**
         * Header: "upgrade-insecure-requests" forces http requests to use https.
         *
         * Disabled in local dev environments to allow http requests in Safari.
         * https://bugs.webkit.org/show_bug.cgi?id=250776
         *
         * Chromium and Firefox still allow http requests to localhost even with this header.
         */
        "upgrade-insecure-requests": !(
          import.meta.env.VITE_FRONTEND_URL === "http://localhost:3000"
        ),
      },
    },
    rateLimiter: {
      // 150 requests per minute. Local machine is not rate limited.
      tokensPerInterval: 150,
      interval: "minute",
      whiteList: ["127.0.0.1"],
    },
    // When true, turns off console.log output? Also look at unplugin-remove Vite Plugin by Talljack.
    removeLoggers: false,
    requestSizeLimiter: {
      maxUploadFileRequestInBytes: 5000000,
    },
  },

  compatibilityDate: "2025-07-13",
});