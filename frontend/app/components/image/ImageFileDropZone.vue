<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    @click="onClickFileInput"
    @dragenter.prevent="isDropZoneActive = true"
    @dragleave.prevent="isDropZoneActive = false"
    @dragover.prevent="isDropZoneActive = true"
    @drop.prevent="
      isDropZoneActive = false;
      $emit('files-dropped', ($event.dataTransfer as DataTransfer)?.files);
    "
    class="flex h-32 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-primary-text bg-layer-0 p-4 text-center text-primary-text"
  >
    <input
      ref="fileInputRef"
      @change="
        $emit('files-dropped', ($event.target as HTMLInputElement)?.files)
      "
      accept="image/jpeg,image/png"
      class="hidden"
      multiple
      type="file"
    />
    <slot :isDropZoneActive="isDropZoneActive" />
  </div>
</template>

<script setup lang="ts">
const isDropZoneActive = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

defineEmits(["files-dropped"]);

/**
 * Handles the click event on the file input. This function is triggered when the user clicks on the drop zone, and it programmatically clicks the hidden file input element to open the file selection dialog. This allows users to select files from their device in addition to dragging and dropping them into the drop zone, providing a more flexible and user-friendly way to add files.
 */
function onClickFileInput() {
  fileInputRef.value?.click();
}
</script>
