<template>
  <div
    v-show="show"
    class="fixed inset-0 z-20 flex items-center justify-center h-screen bg-light-header dark:bg-dark-header"
  >
    <div class="pb-10 loading-pulse">
      <img
        v-if="$colorMode.value == 'light'"
        class="h-40"
        src="/images/content_pages/icons/activist_icon_light.png"
        alt="The activist icon: a lower case letter a with a half circle pointing down and to the left in the center."
      />
      <img
        v-else-if="$colorMode.value == 'dark'"
        class="h-40"
        src="/images/content_pages/icons/activist_icon_dark.png"
        alt="The activist icon: a lower case letter a with a half circle pointing down and to the left in the center."
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
