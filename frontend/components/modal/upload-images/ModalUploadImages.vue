<template>
  <ModalBase
    @closeModal="handleCloseModal"
    :isOpen="modalIsOpen"
    :modalName="modalName"
  >
    <div>
      <DialogTitle>
        <p v-if="uploadLimit > 1" class="responsive-h2 font-bold">
          {{ $t("components.modal_upload_images.upload_images") }}
        </p>
        <p v-else class="responsive-h2 font-bold">
          {{ $t("components.modal_upload_images.upload_an_image") }}
        </p>
      </DialogTitle>
      <div class="mt-4">
        <ModalUploadImagesFileDropZone
          v-if="files.length != uploadLimit"
          @files-dropped="handleFiles"
          v-slot="{ isDropZoneActive }"
        >
          <span v-if="isDropZoneActive && uploadLimit > 1">{{
            $t("components.modal_upload_images.drop_images")
          }}</span>
          <span v-else-if="isDropZoneActive && uploadLimit == 1">{{
            $t("components.modal_upload_images.drop_image")
          }}</span>
          <span v-else-if="!isDropZoneActive && uploadLimit > 1">{{
            $t("components.modal_upload_images.drag_images")
          }}</span>
          <span v-else-if="!isDropZoneActive && uploadLimit == 1">{{
            $t("components.modal_upload_images.drag_image")
          }}</span>
        </ModalUploadImagesFileDropZone>
        <p class="py-2">
          {{ $t("components.modal_upload_images.number_of_files") }}:
          {{ files.length }}
        </p>
        <p
          v-if="uploadLimit == 1 && files.length == uploadLimit"
          class="text-light-action-red dark:text-dark-action-red"
        >
          {{ $t("components.modal_upload_images.picture_limit_1") }}
        </p>
        <p
          v-if="uploadLimit != 1 && files.length >= uploadLimit"
          class="text-light-action-red dark:text-dark-action-red"
        >
          {{
            $t("components.modal_upload_images.picture_limit_multiple", {
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
                    $t('components.modal_upload_images.upload_image') +
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
            :label="$t('components.modal_upload_images.upload')"
            fontSize="sm"
            :leftIcon="IconMap.ARROW_UP"
            iconSize="1.25em"
            ariaLabel="components._global.upvote_application_aria_label"
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
  isOpen: boolean;
  uploadLimit?: number;
}

const props = withDefaults(defineProps<Props>(), {
  uploadLimit: 10,
});

const modals = useModals();
const modalName = "ModalUploadImages";
const modalIsOpen = computed(() => modals.modals[modalName]?.isOpen ?? false);

const handleCloseModal = () => {
  modals.closeModal(modalName);
};
</script>
