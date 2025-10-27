<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <!-- Note: Commented out until such a time when it's needed and triggered explicitly. -->
  <div v-show="loading" class="flex items-center justify-center">
    <div class="loading-pulse pb-10">
      <img
        v-if="$colorMode.value == 'light'"
        :alt="$t('i18n._global.activist_icon_img_alt_text')"
        class="h-40"
        :src="ACTIVIST_ICON_LIGHT_URL"
      />
      <img
        v-else-if="$colorMode.value == 'dark'"
        :alt="$t('i18n._global.activist_icon_img_alt_text')"
        class="h-40"
        :src="ACTIVIST_ICON_DARK_URL"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  loading?: boolean;
}>();
// const nuxtApp = useNuxtApp();
// const show = ref(false);

// addRouteMiddleware(
//   "global-loader",
//   () => {
//     show.value = true;
//   },
//   {
//     global: true,
//   }
// );

// nuxtApp.hook("page:finish", () => {
//   show.value = false;
// });
</script>
