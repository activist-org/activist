<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <!-- Note: image on top of content. -->
  <img
    v-if="!aboveMediumBP"
    :alt="$t(imgAltText)"
    class="mb-4 h-40 sm:h-52"
    :src="imgUrl + '_' + $colorMode.value + '.png'"
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
        :alt="$t(imgAltText)"
        class="float-right block h-52 p-4 lg:h-64"
        :src="imgUrl + '_' + $colorMode.value + '.png'"
      />
      <slot />
    </div>
    <div class="flex justify-end pr-32">
      <!-- Note: image right of content. -->
      <img
        v-if="above2xlBP"
        :alt="$t(imgAltText)"
        class="block h-72"
        :src="imgUrl + '_' + $colorMode.value + '.png'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Props {
  imgUrl: string;
  imgAltText: string;
  includeBreadcrumbs?: boolean;
}

const aboveMediumBP = useBreakpoint("md");
const above2xlBP = useBreakpoint("2xl");

withDefaults(defineProps<Props>(), {
  includeBreadcrumbs: false,
});
</script>
