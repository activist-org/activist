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
      // eslint-disable-next-line no-console
      console.log(
        "setLangAttribute: lang set to:",
        document.documentElement.getAttribute("lang")
      );
    }
  };

  // Monitor for any changes to the lang attribute
  if (import.meta.client) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "lang"
        ) {
          // eslint-disable-next-line no-console
          console.log(
            "Lang attribute changed by:",
            mutation.target,
            "New value:",
            (mutation.target as Element).getAttribute("lang")
          );
          // Log stack trace to see what's changing it
          // eslint-disable-next-line no-console
          console.trace("Stack trace of lang attribute change");
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });
  }

  // Set initial locale from i18n or default to 'en'.
  const initialLocale = $i18n?.locale?.value || "en";
  setLangAttribute(initialLocale);

  // Update on route changes.
  router.afterEach((to) => {
    // Get the locale from the route params or from i18n instance.
    const locale = (to.params.locale as string) || $i18n?.locale?.value || "en";
    // eslint-disable-next-line no-console
    console.log("Route change: setting lang to:", locale);
    setLangAttribute(locale);
  });

  // Update on i18n locale changes (for immediate updates when switching languages).
  if ($i18n) {
    // eslint-disable-next-line no-console
    console.log("Setting up i18n watcher, current locale:", $i18n.locale.value);
    watch(
      () => $i18n.locale.value,
      (newLocale) => {
        // eslint-disable-next-line no-console
        console.log("i18n locale changed to:", newLocale);
        setLangAttribute(newLocale);
      },
      { immediate: false }
    );
  } else {
    // eslint-disable-next-line no-console
    console.log("$i18n not available in plugin");
  }
});
