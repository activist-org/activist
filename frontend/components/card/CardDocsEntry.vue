<template>
  <NuxtLink
    class="card-style hover:bg-light-highlight dark:hover:bg-dark-highlight group flex w-full space-x-4 px-3 py-3 lg:px-4"
    :to="localPath(url)"
  >
    <div
      class="bg-light-menu-selection dark:bg-dark-menu-selection flex h-20 w-20 items-center justify-center rounded-full group-hover:opacity-90 sm:h-24 sm:w-24"
    >
      <!-- Swap image color so that it shows up on a menu selection background. -->
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
      class="text-light-text dark:text-dark-text w-min grow flex-col space-y-2 lg:space-y-4"
    >
      <p class="responsive-h4 font-bold">{{ $t(title) }}</p>
      <p>{{ $t(description) }}</p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const localPath = useLocalePath();

defineProps<{
  url: string;
  imgURL: string;
  imgDimensions: string;
  imgAltText: string;
  title: string;
  description: string;
}>();
</script>
