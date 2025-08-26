<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <MediaImageCarousel
      :fullscreen="true"
      :imageUrls="imageUrls || []"
      :entityType="entityType"
    />
  </ModalBase>
</template>

<script setup lang="ts">
import type { EntityType } from "~/types/entity";
defineProps<{
  imageUrls: string[];
  entityType: EntityType;
}>();
const modalName = "ModalMediaImage";
</script>
