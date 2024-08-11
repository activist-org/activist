<template>
  <ModalBase :modalName="modalName">
    <div>
      <DialogTitle>
        <p v-if="uploadLimit > 1" class="responsive-h2 font-bold">
          {{ $t("components.modal-upload-images.upload-images") }}
        </p>
        <p v-else class="responsive-h2 font-bold">
          {{ $t("components.modal-upload-images.upload-an-image") }}
        </p>
      </DialogTitle>
      <div class="mt-4">
        <ModalUploadImagesFileDropZone
          v-if="files.length != uploadLimit"
          @files-dropped="handleFiles"
          v-slot="{ isDropZoneActive }"
        >
          <span v-if="isDropZoneActive && uploadLimit > 1">{{
            $t("components.modal-upload-images.drop-images")
          }}</span>
          <span v-else-if="isDropZoneActive && uploadLimit == 1">{{
            $t("components.modal-upload-images.drop-image")
          }}</span>
          <span v-else-if="!isDropZoneActive && uploadLimit > 1">{{
            $t("components.modal-upload-images.drag-images")
          }}</span>
          <span v-else-if="!isDropZoneActive && uploadLimit == 1">{{
            $t("components.modal-upload-images.drag-image")
          }}</span>
        </ModalUploadImagesFileDropZone>
        <p class="py-2">
          {{ $t("components.modal-upload-images.number-of-files") }}:
          {{ files.length }}
        </p>
        <p
          v-if="uploadLimit == 1 && files.length == uploadLimit"
          class="text-light-action-red dark:text-dark-action-red"
        >
          {{ $t("components.modal-upload-images.picture-limit-1") }}
        </p>
        <p
          v-if="uploadLimit != 1 && files.length >= uploadLimit"
          class="text-light-action-red dark:text-dark-action-red"
        >
          {{
            $t("components.modal-upload-images.picture-limit-multiple", {
              limit: uploadLimit,
            })
          }}
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
                  <Icon :name="IconMap.X_SM" size="1.5em" />
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
            :leftIcon="IconMap.ARROW_UP"
            iconSize="1.25em"
            ariaLabel="components.btn-action.upvote-application-aria-label"
            :disabled="files.length >= uploadLimit"
          />
        </div>
      </div>
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import { DialogTitle } from "@headlessui/vue";
import draggable from "vuedraggable";
import { IconMap } from "~/types/icon-map";

const { files, handleFiles, removeFile } = useFileManager();

export interface Props {
  uploadLimit?: number;
}

const props = withDefaults(defineProps<Props>(), {
  uploadLimit: 10,
});

const modalName = "ModalUploadImages";
</script>
