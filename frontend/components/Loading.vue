<template>
  <!-- Loading Overlay -->
  <div
    v-show="show"
    class="fixed inset-0 z-50 flex h-screen items-center justify-center bg-light-layer-2 dark:bg-dark-layer-2"
    aria-hidden="true"
  >
    <div class="loading-pulse pb-10">
      <!-- Light Mode Image -->
      <img
        v-if="$colorMode.value === 'light'"
        class="h-40"
        :src="ACTIVIST_ICON_LIGHT_URL"
        :alt="$t('_global.activist_icon_img_alt_text')"
        @error="onImageError"
      />
      <!-- Dark Mode Image -->
      <img
        v-else
        class="h-40"
        :src="ACTIVIST_ICON_DARK_URL"
        :alt="$t('_global.activist_icon_img_alt_text')"
        @error="onImageError"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useNuxtApp } from "#app";

const nuxtApp = useNuxtApp();
const show = ref(false);

// Add global route middleware to display loader
addRouteMiddleware(
  "global-loader",
  () => {
    show.value = true;
  },
  {
    global: true,
  }
);

// Hide loader when page finishes loading
nuxtApp.hook("page:finish", () => {
  show.value = false;
});

// Fallback for broken image URLs
const onImageError = () => {
  console.error("Image failed to load. Falling back to default loader.");
};
</script>
