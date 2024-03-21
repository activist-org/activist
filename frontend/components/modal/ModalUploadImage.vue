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
import ModalBase from '~/components/modal/ModalBase.vue';
import useFileManager from '~/composables/useFileManager';

const { files, handleFiles, removeFile } = useFileManager();
</script>