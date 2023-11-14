<template>
  <NuxtLink
    class="flex w-full px-3 py-3 group card-style space-x-4 lg:px-4 hover:bg-light-highlight dark:hover:bg-dark-highlight"
    :to="localPath(url)"
  >
    <div
      class="flex items-center justify-center w-20 h-20 rounded-full bg-light-menu-selection dark:bg-dark-menu-selection sm:w-24 sm:h-24 group-hover:opacity-90"
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
      class="flex-col grow w-min space-y-2 lg:space-y-4 text-light-text dark:text-dark-text"
    >
      <p class="font-bold responsive-h4">{{ $t(title) }}</p>
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
