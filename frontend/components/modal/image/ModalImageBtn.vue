<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <button
    class="focus-brand h-min cursor-pointer p-4 md:float-right md:w-1/3 2xl:col-span-1 2xl:w-full"
    :aria-label="$t('i18n.components.modal_image_btn.open_modal_aria_label')"
  >
    <img
      v-if="$colorMode.value == 'light'"
      :src="imgUrl + '_light.png'"
      :alt="$t(imageAltText)"
    />
    <img
      v-else-if="$colorMode.value == 'dark'"
      :src="imgUrl + '_dark.png'"
      :alt="$t(imageAltText)"
    />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  imgUrl: string;
  imageAltText: string;
}>();
</script>
