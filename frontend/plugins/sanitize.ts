import sanitizeDirective from "~/directives/sanitize";

export default defineNuxtPlugin((nuxtApp) => {
  // TODO: Not sure why 'directive' creates the 'Property 'directive' does not exist on type 'App<Element>'.' error.
  // TODO: The app looks like it working.
  // TODO: i18n-head.ts, in the same folder as this file, has a similar problem.
  nuxtApp.vueApp.directive("sanitize", sanitizeDirective);
});
