<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    @dragenter.prevent="isDropZoneActive = true"
    @dragleave.prevent="isDropZoneActive = false"
    @dragover.prevent="isDropZoneActive = true"
    @drop.prevent="
      isDropZoneActive = false;
      $emit('files-dropped', ($event.dataTransfer as DataTransfer)?.files);
    "
    @click="onClickFileInput"
    class="flex h-32 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-primary-text bg-layer-0 p-4 text-center text-primary-text"
  >
    <input
      @change="
        $emit('files-dropped', ($event.target as HTMLInputElement)?.files)
      "
      ref="fileInputRef"
      type="file"
      class="hidden"
      accept="image/jpeg,image/png"
      multiple
    />
    <slot :isDropZoneActive="isDropZoneActive" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isDropZoneActive = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

defineEmits(["files-dropped"]);

function onClickFileInput() {
  fileInputRef.value?.click();
}
</script>
