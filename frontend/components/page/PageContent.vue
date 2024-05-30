<template>
  <!-- Note: image on top of content. -->
  <img
    v-if="!medium"
    class="mb-4 h-40 sm:h-52"
    :src="imgURL + '_' + $colorMode.value + '.png'"
    :alt="$t(imgAltText)"
  />
  <div
    class="grid grid-cols-1 md:w-full 2xl:grid-cols-2"
    :class="{
      'w-11/12 sm:w-10/12': includeBreadcrumbs,
    }"
  >
    <div class="items-center space-y-4 text-left md:items-start">
      <!-- Note: image floating right of content. -->
      <img
        v-if="medium && !xxl"
        class="float-right block h-52 p-4 lg:h-64"
        :src="imgURL + '_' + $colorMode.value + '.png'"
        :alt="$t(imgAltText)"
      />
      <PageBreadcrumbs v-if="includeBreadcrumbs && medium" />
      <slot />
    </div>
    <div class="flex justify-end pr-32">
      <!-- Note: image right of content. -->
      <img
        v-if="xxl"
        class="block h-72"
        :src="imgURL + '_' + $colorMode.value + '.png'"
        :alt="$t(imgAltText)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import useBreakpoint from "~/composables/useBreakpoint";
const medium = useBreakpoint("md");
const xxl = useBreakpoint("2xl");

export interface Props {
  imgURL: string;
  imgAltText: string;
  includeBreadcrumbs?: boolean;
}

withDefaults(defineProps<Props>(), {
  includeBreadcrumbs: false,
});
</script>
