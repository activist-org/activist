<template>
  <!-- Note: Commented out until such a time when it's needed and triggered explicitly. -->
  <div />
  <!-- <div
    v-show="show"
    class="fixed inset-0 z-50 flex h-screen items-center justify-center bg-light-layer-2 dark:bg-dark-layer-2"
  >
    <div class="loading-pulse pb-10">
      <img
        v-if="$colorMode.value == 'light'"
        class="h-40"
        :src="ACTIVIST_ICON_LIGHT_URL"
        :alt="$t('_global.activist_icon_img_alt_text')"
      />
      <img
        v-else-if="$colorMode.value == 'dark'"
        class="h-40"
        :src="ACTIVIST_ICON_DARK_URL"
        :alt="$t('_global.activist_icon_img_alt_text')"
      />
    </div>
  </div> -->
</template>

<script setup lang="ts">
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
