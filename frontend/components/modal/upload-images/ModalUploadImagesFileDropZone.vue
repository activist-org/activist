<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="flex h-32 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-primary-text bg-layer-0 p-4 text-center text-primary-text"
    @dragenter.prevent="isDropZoneActive = true"
    @dragleave.prevent="isDropZoneActive = false"
    @dragover.prevent="isDropZoneActive = true"
    @drop.prevent="
      isDropZoneActive = false;
      $emit('files-dropped', ($event.dataTransfer as DataTransfer)?.files);
    "
    @click="$refs.file.click()"
  >
    <input
      ref="file"
      type="file"
      class="hidden"
      accept="image/jpeg,image/png"
      @change="
        $emit('files-dropped', ($event.target as HTMLInputElement)?.files)
      "
      multiple
    />
    <slot :isDropZoneActive="isDropZoneActive" />
  </div>
</template>

<script setup lang="ts">
const isDropZoneActive = ref(false);
</script>
