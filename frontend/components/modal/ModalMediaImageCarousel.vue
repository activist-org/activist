<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <MediaImageCarousel :fullscreen="true" :imageUrls="props.imageUrls || []" />
  </ModalBase>
</template>

<script setup lang="ts">
const props = defineProps({
  imageUrls: Array<string>,
});
const modalName = "ModalMediaImage";
</script>
