<template>
  <div
    v-show="show"
    class="fixed inset-0 z-50 flex items-center justify-center h-screen bg-light-layer-2 dark:bg-dark-layer-2"
  >
    <div class="pb-10 loading-pulse">
      <img
        v-if="$colorMode.value == 'light'"
        class="h-40"
        src="/images/content_pages/icons/activist_icon_light.png"
        :alt="$t('_global.activist-icon-img-alt-text')"
      />
      <img
        v-else-if="$colorMode.value == 'dark'"
        class="h-40"
        src="/images/content_pages/icons/activist_icon_dark.png"
        :alt="$t('_global.activist-icon-img-alt-text')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp();
const show = ref(false);

addRouteMiddleware(
  "global-loader",
  () => {
    show.value = true;
  },
  {
    global: true,
  }
);

nuxtApp.hook("page:finish", () => {
  show.value = false;
});
</script>
