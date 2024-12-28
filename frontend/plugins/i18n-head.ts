import type { Router } from "#vue-router";

// Injects the lang attribute in all Nuxt <Head></Head> components.
export default defineNuxtPlugin((nuxtApp) => {
  const router: Router = nuxtApp.vueApp.config.globalProperties.$router;
  router.afterEach((to) => {
    const languageCode = to.fullPath.split("/")[1] || "en";
    document.documentElement.setAttribute("lang", languageCode);
  });
});
