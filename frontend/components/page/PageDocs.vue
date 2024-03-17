<template>
  <div
    class="text-light-text dark:text-dark-text bg-light-layer-0 dark:bg-dark-layer-0"
  >
    <div
      class="flex flex-col items-center w-full responsive-py-4 responsive-px-5"
    >
      <!-- Note: image on top of content. -->
      <img
        class="h-40 mb-4 md:hidden sm:h-52"
        :src="imgURL + '_' + $colorMode.value + '.png'"
        :alt="$t(imgAltText)"
      />
      <div class="w-10/12 grid grid-cols-1 md:w-full 2xl:grid-cols-2">
        <div class="items-center text-left space-y-4 md:items-start">
          <!-- Note: image floating right of content. -->
          <img
            class="hidden float-right p-4 h-52 md:block 2xl:hidden lg:h-64"
            :src="imgURL + '_' + $colorMode.value + '.png'"
            :alt="$t(imgAltText)"
          />
          <PageBreadcrumbs />
          <slot />
        </div>
        <div class="flex justify-end pr-32">
          <!-- Note: image right of content. -->
          <img
            class="hidden 2xl:block h-72"
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
