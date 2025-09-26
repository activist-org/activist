// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Router } from "#vue-router";

// Injects the lang attribute in all Nuxt <Head></Head> components.
export default defineNuxtPlugin((nuxtApp) => {
  const router: Router = nuxtApp.vueApp.config.globalProperties.$router;
  const $i18n = nuxtApp.$i18n as { locale: { value: string } };

  // Set initial lang attribute.
  const setLangAttribute = (locale: string) => {
    if (import.meta.client) {
      document.documentElement.setAttribute("lang", locale);
    }
  };

  // Set initial locale from i18n or default to 'en'.
  const initialLocale = $i18n?.locale?.value || "en";
  setLangAttribute(initialLocale);

  // Update on route changes.
  router.afterEach((to) => {
    // Get the locale from the route params or default to 'en'.
    const locale = (to.params.locale as string) || "en";
    setLangAttribute(locale);
  });

  // Update on i18n locale changes (for immediate updates when switching languages).
  if ($i18n) {
    watch(
      () => $i18n.locale.value,
      (newLocale) => {
        setLangAttribute(newLocale);
      },
      { immediate: false }
    );
  }
});
