<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <MediaImageCarousel :fullscreen="true" :imageUrls="imageUrls || []" />
  </ModalBase>
</template>

<script setup lang="ts">
defineProps<{
  imageUrls: string[];
}>();

const modalName = "ModalMediaImage";
</script>
