<template>
  <button
    class="focus-brand h-min cursor-pointer p-4 md:float-right md:w-1/3 2xl:col-span-1 2xl:w-full"
    :aria-label="$t('components.modal-image.open-modal-aria-label')"
  >
    <img
      v-if="$colorMode.value == 'light'"
      :src="imageURL + '_light.png'"
      :alt="$t(imageAltText)"
    />
    <img
      v-else-if="$colorMode.value == 'dark'"
      :src="imageURL + '_dark.png'"
      :alt="$t(imageAltText)"
    />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  imageURL: string;
  imageAltText: string;
}>();
</script>
