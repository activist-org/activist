<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="relative">
    <MediaImageCarousel
      :fullscreen="false"
      :imageUrls="imageUrls"
    />
    <button
      @click="openMediaImageCarousel()"
      @keydown.enter="openMediaImageCarousel()"
      class="focus-brand absolute right-2 top-2 z-10 hidden rounded-lg border border-black/80 bg-white/80 p-1 text-black/80 dark:border-white/80 dark:bg-black/80 dark:text-white/80 md:block"
    >
      <Icon :name="IconMap.FULL_SCREEN" size="1.5em" />
    </button>
    <ModalMediaImageCarousel
    @closeModal="handleCloseMediaImageCarousel"
    :imageUrls="imageUrls"
    :entityId="props.entityId"
    :entityType="props.entityType"
    />
  </div>
</template>

<script setup lang="ts">
import type { EntityType } from "~/types/entity";

import { IconMap } from "~/types/icon-map";

const props = defineProps<{ entityType: EntityType, entityId:string }>();

const {
  openModal: openMediaImageCarousel,
  handleCloseModal: handleCloseMediaImageCarousel,
} = useModalHandlers("ModalMediaImage");
const { imageUrls } = useFileManager(props.entityId);

</script>
