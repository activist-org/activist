<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <MediaImageCarousel
      :entityType="entityType"
      :fullscreen="true"
      :imageUrls="imageUrls"
    />
  </ModalBase>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    imageUrls?: string[];
    entityType: EntityType;
  }>(),
  {
    imageUrls: () => [],
  }
);
const modalName = "ModalMediaImage";
</script>
