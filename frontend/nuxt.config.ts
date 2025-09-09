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
  auth: {
    baseURL: process.env.VITE_BACKEND_URL || "http://localhost:8000/api/auth",
    provider: {
      type: "local",
      isEnabled: true,
      disableServerSideAuth: false,
      originEnvKey: "VITE_BACKEND_URL",
      pages: {
        login: "/auth/sign-in",
      },
      endpoints: {
        signIn: { path: "v1/auth/sign_in", method: "post" },
        signOut: { path: "v1/auth/sign_out", method: "post" },
        signUp: { path: "/auth/register", method: "post" },
        getSession: { path: "v1/auth/sessions", method: "get" },
      },
      refresh: {
        isEnabled: true,
        endpoint: { path: "v1/auth/token/refresh", method: "post" },
        refreshOnlyToken: true,
        token: {
          signInResponseRefreshTokenPointer: "/refresh",
          refreshRequestTokenPointer: "/refresh",
          cookieName: "auth.refresh",
          maxAgeInSeconds: 1800,
          secureCookieAttribute: false,
          httpOnlyCookieAttribute: false,
        },
      },
      session: {
        dataType: {
          id: "string | number",
          access: "string",
          refresh: "string",
          user: {
            id: "string | number",
            username: "string",
            isAdmin: "boolean",
            isActive: "boolean",
            isStaff: "boolean",
            isSuperuser: "boolean",
            email: "string",
          },
        },
      },
      token: {
        signInResponseTokenPointer: "/access",
        signInResponseRefreshTokenPointer: "/refresh",
        type: "Token",
        headerName: "Authorization",
        maxAgeInSeconds: 1800,
        secureCookieAttribute: false,
        httpOnlyCookieAttribute: false,
      },
    },
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
    strategy: "prefix_and_default",
    langDir: "./i18n",
    vueI18n: "./i18n.config.ts",
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
      isCustomElement: (tag) =>
        ["swiper-slide", "swiper-container"].includes(tag),
    },
  },

  hooks: {
    "pages:extend": (pages: NuxtPage[]) => {
      applyMiddleware(pages);
    },
    "app:resolve": (_app) => {
      // Note: For future implementation.
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
});
