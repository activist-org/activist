<template>
  <!-- Note: image on top of content. -->
  <img
    v-if="!aboveMediumBP"
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
        v-if="aboveMediumBP && !above2xlBP"
        class="float-right block h-52 p-4 lg:h-64"
        :src="imgURL + '_' + $colorMode.value + '.png'"
        :alt="$t(imgAltText)"
      />
      <slot />
    </div>
    <div class="flex justify-end pr-32">
      <!-- Note: image right of content. -->
      <img
        v-if="above2xlBP"
        class="block h-72"
        :src="imgURL + '_' + $colorMode.value + '.png'"
        :alt="$t(imgAltText)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Props {
  imgURL: string;
  imgAltText: string;
  includeBreadcrumbs?: boolean;
}

const aboveMediumBP = useBreakpoint("md");
const above2xlBP = useBreakpoint("2xl");

withDefaults(defineProps<Props>(), {
  includeBreadcrumbs: false,
});
</script>
