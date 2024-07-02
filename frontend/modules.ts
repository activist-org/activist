import type { NuxtModule } from "@nuxt/schema";

const modules: (string | [string, Record<string, any>] | NuxtModule)[] = [
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
];

export default modules;
