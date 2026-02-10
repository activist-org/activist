// SPDX-License-Identifier: AGPL-3.0-or-later
// https://nuxt.com/docs/api/configuration/nuxt-config
import type { NuxtPage } from "nuxt/schema";

import tailwindcss from "@tailwindcss/vite";

import applyMiddleware from "./applyMiddleware";
import head from "./head";
import modules from "./modules";
import locales from "./shared/utils/locales";

export default defineNuxtConfig({
  app: {
    head,
  },
  runtimeConfig: {
    apiSecret: process.env.VITE_BACKEND_URL_PROXY,
    public: {
      apiBase: process.env.VITE_BACKEND_URL || "http://localhost:8000",
    },
  },
  modules: process.env.VITEST ? [] : modules,
  ssr: false,

  devtools: {
    enabled: true,
  },

  plugins: ["~/plugins/i18n-head.ts", "~/plugins/i18n-iso-countries.ts"],
  // Auto import services and stores.
  imports: {
    dirs: ["./constants", "./services", "./stores"],
  },

  vite: {
    plugins: [tailwindcss()],
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

  css: ["~/assets/css/tailwind.css", "reduced-motion/css"],

  postcss: {
    plugins: {
      autoprefixer: {},
    },
  },

  i18n: {
    strategy: "prefix_and_default",
    langDir: "locales",
    vueI18n: "i18n.config.ts",
    baseUrl: "https://activist.org",
    defaultLocale: "en",
    locales,
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
      isCustomElement: (tag: string) =>
        ["swiper-slide", "swiper-container"].includes(tag),
    },
  },

  hooks: {
    "pages:extend": (pages: NuxtPage[]) => {
      applyMiddleware(pages);
    },
    "app:resolve": (_app: unknown) => {
      // Note: For future implementation.
    },
  },

  nitro: {
    // Use node-server preset for local preview/Docker (creates .output/server/index.mjs)
    // Use netlify-static preset for Netlify deployment (creates static site)
    preset: process.env.USE_PREVIEW === "true" ? undefined : "netlify-static",
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
        "img-src": ["'self'", "data:", "blob:"],
        "script-src": [
          "'self'",
          "https:",
          "'unsafe-inline'",
          "'strict-dynamic'",
          "'nonce-{{nonce}}'", // Nuxt Security injects the nonce here
          "'unsafe-eval'",
        ],
        /**
         * Header: "upgrade-insecure-requests" forces http requests to use https.
         *
         * Disabled in local dev environments to allow http requests in Safari.
         * https://bugs.webkit.org/show_bug.cgi?id=250776
         *
         * Chromium and Firefox still allow http requests to localhost even with this header.
         */
        "upgrade-insecure-requests":
          import.meta.env.VITE_FRONTEND_URL !== "http://localhost:3000",
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
} as unknown as Parameters<typeof defineNuxtConfig>[0]);
