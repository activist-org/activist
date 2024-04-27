<template>
  <div
    class="bg-light-layer-0 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <div
      class="responsive-py-4 responsive-px-5 flex w-full flex-col items-center"
    >
      <div class="flex w-10/12 items-start pb-2 md:w-full">
        <PageBreadcrumbs class="md:hidden" />
      </div>
      <!-- Note: image on top of content. -->
      <img
        class="mb-4 h-40 sm:h-52 md:hidden"
        :src="imgURL + '_' + $colorMode.value + '.png'"
        :alt="$t(imgAltText)"
      />
      <div class="grid w-10/12 grid-cols-1 md:w-full 2xl:grid-cols-2">
        <div class="items-center space-y-4 text-left md:items-start">
          <!-- Note: image floating right of content. -->
          <img
            class="float-right hidden h-52 p-4 md:block lg:h-64 2xl:hidden"
            :src="imgURL + '_' + $colorMode.value + '.png'"
            :alt="$t(imgAltText)"
          />
          <PageBreadcrumbs class="hidden md:block" />
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
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  imgURL: string;
  imgAltText: string;
}>();
</script>
