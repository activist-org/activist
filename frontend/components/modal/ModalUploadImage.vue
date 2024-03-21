<template>
  <ModalBase>
    <template #normalDisplay>
      <slot name="normalDisplay" />
    </template>
    <template #modalDisplay>
      <div>
        <DialogTitle class="font-display">
          <p class="font-bold responsive-h2">
            Upload Image
          </p>
        </DialogTitle>
        <div class="mt-2">
          <FileDropZone @files-dropped="handleFiles" v-slot="{ isDropZoneActive }">
              <span v-if="isDropZoneActive">
                  <span>Drop Them Here</span>
                  <span class="smaller"> to add them</span>
              </span>
              <span v-else>
                  <span>Drag Your Files Here</span>
                  <span class="smaller">
                      or <strong><em>click here</em></strong> to select files
                  </span>
              </span>
          </FileDropZone>
          <p>Number of files: {{ files.length }}</p>
          <div class="flex flex-row">
            <span v-for="file in files" class="p-2">
              <button @click="removeFile(file)" class="text-red-500">X</button>
              <img
                :key="file.name"
                :src="file.url"
                class="w-28 h-28 object-contain"
                :alt="'uploaded file' + file.name"
              />
            </span>
          </div>
        </div>
      </div>
    </template>
  </ModalBase>
</template>

<script setup lang="ts">
import { DialogTitle } from '@headlessui/vue';
import { ref } from 'vue';
import ModalBase from '~/components/modal/ModalBase.vue';

const files = ref<UploadableFile[]>([]);
  function handleFiles(newFiles: File[]) {
        const newUploadableFiles = [...newFiles]
            .map((file) => new UploadableFile(file))
            .filter((file) => !fileExists(file.id))
        files.value = [...files.value, ...newUploadableFiles];
  }

  function fileExists(otherId: string) {
      return files.value.some(({ id }) => id === otherId)
  }

  function removeFile(file: UploadableFile) {
      const index = files.value.indexOf(file)

      if (index > -1) files.value.splice(index, 1)
  }


class UploadableFile {
file: File;
url: string;
name: string;
status: null;
id: string;
    constructor(file: File) {
        this.file = file
        this.name = file.name
        this.id = `${file.name}-${file.size}-${file.lastModified}-${file.type}`
        this.url = URL.createObjectURL(file)
        this.status = null
    }
}
</script>