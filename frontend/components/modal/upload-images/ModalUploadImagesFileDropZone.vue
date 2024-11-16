<template>
  <DropZone @files-dropped="handleFiles">
    <template #default="{ isDropZoneActive }">
      <div
        class="flex flex-col items-center justify-center text-center"
        :class="{ 'text-blue-500': isDropZoneActive }"
      >
        <Icon name="upload" class="h-16 w-16" />
        <p>{{ isDropZoneActive ? 'Drop files here!' : 'Drag and drop files or click to upload' }}</p>
      </div>
    </template>
  </DropZone>
</template>

<script setup lang="ts">
import DropZone from "./DropZone.vue";

function handleFiles(files: File[]) {
  console.log("Uploaded files:", files);
}
</script>
