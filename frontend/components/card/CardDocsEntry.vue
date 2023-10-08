<template>
  <nuxtlink
    class="group flex w-full card-style px-3 py-3 space-x-4 lg:px-4 hover:bg-light-highlight dark:hover:bg-dark-highlight"
    :to="url"
  >
    <div
      class="flex justify-center items-center rounded-full bg-light-menu-selection dark:bg-dark-menu-selection w-20 sm:w-24 h-20 sm:h-24 group-hover:opacity-90"
    >
      <!-- swap image color so that it shows up on a menu selection background. -->
      <img
        v-if="$colorMode.value == 'light'"
        :class="imgDimensions"
        :src="imgURL + '_' + 'dark.png'"
        :alt="$t(imgAltText)"
      />
      <img
        v-else
        :class="imgDimensions"
        :src="imgURL + '_' + 'light.png'"
        :alt="$t(imgAltText)"
      />
    </div>
    <div
      class="grow w-min flex-col space-y-2 lg:space-y-4 text-light-text dark:text-dark-text"
    >
      <p class="font-bold responsive-h4">{{ $t(title) }}</p>
      <p>{{ $t(description) }}</p>
    </div>
  </nuxtlink>
</template>

<script setup lang="ts">
defineProps<{
  url: string;
  imgURL: string;
  imgDimensions: string;
  imgAltText: string;
  title: string;
  description: string;
}>();
</script>
