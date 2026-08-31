// SPDX-License-Identifier: AGPL-3.0-or-later
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.globalProperties.IconMap = IconMap;
  nuxtApp.vueApp.config.globalProperties.BreakpointMap = BreakpointMap;
  nuxtApp.vueApp.config.globalProperties.EntityMap = EntityMap;
  nuxtApp.vueApp.config.globalProperties.ColorByEventTypeAndTheme =
    ColorByEventTypeAndTheme;
});
