// SPDX-License-Identifier: AGPL-3.0-or-later
// NOTE: This plugin watches for global errors in a Nuxt application
// and logs them to the console, it would be ideal to replace with our own logging service in the future.
// and secondly this is temporary until SSR is properly handled in the app.
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:error", (error) => {
    // eslint-disable-next-line no-console
    console.error("Global Nuxt error:", error);
  });
  nuxtApp.hook("vue:error", (error, _, info) => {
    // eslint-disable-next-line no-console
    console.error("Vue error:", error);
    // eslint-disable-next-line no-console
    console.log("Vue info:", info);
  });
});
