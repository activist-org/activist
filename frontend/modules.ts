// SPDX-License-Identifier: AGPL-3.0-or-later
import type { NuxtModule } from "@nuxt/schema";

const modules: (string | [string, Record<string, object>] | NuxtModule)[] = [
  "@nuxt/content",
  "nuxt-icon",
  // [
  //   "nuxt-mail",
  //   {
  //     message: {
  //       to: "team@activist.org",
  //     },
  //     smtp: {
  //       host: "smtp.activist.org",
  //       port: 587,
  //     },
  //   },
  // ],
  "@nuxtjs/color-mode",
  "@nuxtjs/device",
  "@nuxt/devtools",
  "@nuxt/eslint",
  "@nuxtjs/i18n",
  "@nuxtjs/plausible",
  "@nuxtjs/tailwindcss",
];

// This plugin may depend on Pinia.
const vueUse = "@vueuse/nuxt";
if (process.env.VITEST) {
  modules.push(vueUse);
} else {
  // These modules currently do not work in a vitest environment:
  // @pinia/nuxt
  // pinia-plugin-persistedstate/nuxt
  modules.push("@pinia/nuxt", vueUse, "pinia-plugin-persistedstate/nuxt");
}

export default modules;
