<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <MediaImageCarousel
      :fullscreen="true"
      :imageUrls="imageUrls || []"
      :fileUploadEntity="props.fileUploadEntity"
    />
  </ModalBase>
</template>

<script setup lang="ts">
import type { FileUploadEntity } from "~/types/content/file-upload-entity";

const props = defineProps<{
  imageUrls: string[];
  fileUploadEntity: FileUploadEntity;
}>();

const modalName = "ModalMediaImage";
</script>
