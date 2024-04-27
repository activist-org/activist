<template>
  <ModalBase>
    <template #normalDisplay>
      <slot name="normalDisplay" />
    </template>
    <template #modalDisplay>
      <div>
        <DialogTitle>
          <p class="responsive-h2 font-bold">
            {{ $t("components.modal-upload-images.upload-images") }}
          </p>
        </DialogTitle>
        <div class="mt-4">
          <FileDropZone
            @files-dropped="handleFiles"
            v-slot="{ isDropZoneActive }"
          >
            <span v-if="isDropZoneActive">{{
              $t("components.modal-upload-images.drop-images")
            }}</span>
            <span v-else>{{
              $t("components.modal-upload-images.drag-images")
            }}</span>
          </FileDropZone>
          <p class="py-2">
            {{ $t("components.modal-upload-images.number-of-files") }}:
            {{ files.length }}
          </p>
          <p
            v-if="files.length > 10"
            class="text-light-action-red dark:text-dark-action-red"
          >
            {{ $t("components.modal-upload-images.picture-limit") }}
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
                <span class="pb-4">
                  <button
                    @click="removeFile(file)"
                    class="text-light-action-red dark:text-dark-action-red"
                  >
                    <Icon name="bi:x" size="1.5em" />
                  </button>
                  <img
                    :key="file.name"
                    :src="file.url"
                    class="h-20 w-20 object-contain"
                    :alt="
                      $t('components.modal-upload-images.upload-image') +
                      ' ' +
                      file.name
                    "
                  />
                </span>
              </template>
            </draggable>
            <BtnAction
              @click="true"
              :cta="true"
              :label="$t('components.modal-upload-images.upload')"
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
import { DialogTitle } from "@headlessui/vue";
import draggable from "vuedraggable";

const { files, handleFiles, removeFile } = useFileManager();
</script>
