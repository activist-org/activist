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
          <p
            v-if="files.length > 10"
            class="text-light-action-red dark:text-dark-action-red"
          >
            You are not allowed to have more than 10 pictures.
          </p>
          <div>
            <draggable
              v-model="files"
              tag="div"
              class="flex flex-row"
              animation="300"
              ghost-class="opacity-0"
            >
              <template #item="{ element: file }">
                <span class="p-2">
                  <button
                    @click="removeFile(file)"
                    class="text-light-action-red dark:text-dark-action-red"
                  >X</button>
                  <img
                    :key="file.name"
                    :src="file.url"
                    class="w-20 h-20 object-contain"
                    :alt="'uploaded file' + file.name"
                  />
                </span>
              </template>
            </draggable>
            <BtnAction
              @click="alert('aaa')"
              class="flex mr-5"
              :cta="true"
              :label="'Upload'"
              fontSize="sm"
              leftIcon="bi:arrow-up"
              iconSize="1.25em"
              ariaLabel="components.btn-action.upvote-application-aria-label"
              :disabled="files.length > 10"
            />
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
import draggable from 'vuedraggable';

const { files, handleFiles, removeFile } = useFileManager();
</script>