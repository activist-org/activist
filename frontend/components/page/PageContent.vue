<template>
  <!-- Note: image on top of content. -->
  <img
    class="mb-4 h-40 sm:h-52 md:hidden"
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
        class="float-right hidden h-52 p-4 md:block lg:h-64 2xl:hidden"
        :src="imgURL + '_' + $colorMode.value + '.png'"
        :alt="$t(imgAltText)"
      />
      <PageBreadcrumbs v-if="includeBreadcrumbs" class="hidden md:block" />
      <slot />
    </div>
    <div class="flex justify-end pr-32">
      <!-- Note: image right of content. -->
      <img
        class="hidden h-72 2xl:block"
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

withDefaults(defineProps<Props>(), {
  includeBreadcrumbs: false,
});
</script>
