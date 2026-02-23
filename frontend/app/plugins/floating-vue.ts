// SPDX-License-Identifier: AGPL-3.0-or-later
import FloatingVue from "floating-vue";
import "floating-vue/dist/style.css";
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(FloatingVue, {
    themes: {
      tooltip: {
        html: true,
      },
    },
  });
});
