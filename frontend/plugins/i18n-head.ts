// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Router } from "#vue-router";

// Injects the lang attribute in all Nuxt <Head></Head> components.
export default defineNuxtPlugin((nuxtApp) => {
  const router: Router = nuxtApp.vueApp.config.globalProperties.$router;

  // Set initial lang attribute.
  const setLangAttribute = (locale: string) => {
    document.documentElement.setAttribute("lang", locale);
  };

  // Set initial locale - default to 'en' if i18n is not available.
  setLangAttribute("en");

  // Update on route changes.
  router.afterEach((to) => {
    // Get the locale from the route params or default to 'en'.
    const locale = (to.params.locale as string) || "en";
    setLangAttribute(locale);
  });
});
