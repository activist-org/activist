<template>
  <div
    v-if="feedItemURLs && feedItemNames"
    class="mt-3 flex items-center justify-start space-x-3"
  >
    <div
      v-for="(url, index) in feedItemURLs.slice(0, numberOfFeedItems)"
      class="w-full"
    >
      <FeedItem :name="feedItemNames[index]" :url="url" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Breakpoint } from "~/types/breakpoints";

defineProps<{
  feedItemNames?: string[];
  feedItemURLs?: string[];
}>();

const currentWidth = ref(window.innerWidth);
const numberOfFeedItems = ref(1);
let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

const updateWidth = () => {
  currentWidth.value = window.innerWidth;
  if (currentWidth.value < Breakpoint.SMALL) {
    numberOfFeedItems.value = 1;
  } else if (currentWidth.value < Breakpoint.LARGE) {
    numberOfFeedItems.value = 2;
  } else if (currentWidth.value < Breakpoint.XL) {
    numberOfFeedItems.value = 3;
  } else if (currentWidth.value < Breakpoint.XXXL) {
    numberOfFeedItems.value = 4;
  } else {
    numberOfFeedItems.value = 5;
  }
};

const handleResize = () => {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
  resizeTimeout = setTimeout(updateWidth, 100);
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
  updateWidth();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
