<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <div>
      <DialogTitle>
        <h2 v-if="uploadLimit > 1" class="font-bold">
          {{ $t("i18n.components.modal_upload_images.upload_images") }}
        </h2>
        <h2 v-else class="font-bold">
          {{ $t("i18n.components.modal_upload_images.upload_an_image") }}
        </h2>
      </DialogTitle>
      <div class="mt-4">
        <ModalUploadImagesFileDropZone
          v-if="files.length != uploadLimit"
          @files-dropped="handleFiles"
          v-slot="{ isDropZoneActive }"
        >
          <span v-if="isDropZoneActive && uploadLimit > 1">{{
            $t("i18n.components.modal_upload_images.drop_images")
          }}</span>
          <span v-else-if="isDropZoneActive && uploadLimit == 1">{{
            $t("i18n.components.modal_upload_images.drop_image")
          }}</span>
          <span v-else-if="!isDropZoneActive && uploadLimit > 1">{{
            $t("i18n.components.modal_upload_images.drag_images")
          }}</span>
          <span v-else-if="!isDropZoneActive && uploadLimit == 1">{{
            $t("i18n.components.modal_upload_images.drag_image")
          }}</span>
        </ModalUploadImagesFileDropZone>
        <p class="py-2">
          {{ $t("i18n.components.modal_upload_images.number_of_files") }}:
          {{ files.length }}
        </p>
        <p
          v-if="uploadLimit == 1 && files.length > uploadLimit"
          class="text-action-red"
        >
          {{ $t("i18n.components.modal_upload_images.picture_limit_1") }}
        </p>
        <p
          v-if="uploadLimit != 1 && files.length >= uploadLimit"
          class="text-action-red"
        >
          {{
            $t("i18n.components.modal_upload_images.picture_limit_multiple", {
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
                <button @click="removeFile(file)" class="text-action-red">
                  <Icon :name="IconMap.X_SM" size="1.5em" />
                </button>
                <img
                  :key="file.name"
                  :src="file.url"
                  class="h-20 w-20 object-contain"
                  :alt="
                    $t('i18n.components.modal_upload_images.upload_image') +
                    ' ' +
                    file.name
                  "
                />
              </span>
            </template>
          </draggable>
          <BtnAction
            v-if="files.length > 0"
            @click="handleUpload"
            :cta="true"
            label="i18n.components.modal_upload_images.upload"
            fontSize="sm"
            :leftIcon="IconMap.ARROW_UP"
            iconSize="1.25em"
            ariaLabel="i18n.components._global.upvote_application_aria_label"
            :disabled="files.length === 0 || files.length > uploadLimit"
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

const { files, handleFiles, removeFile, uploadFiles } = useFileManager();

const eventStore = useEventStore();
const groupStore = useGroupStore();
const organizationStore = useOrganizationStore();

const modals = useModals();

const fileUploadEntity = computed(() => {
  return modals.modals[modalName]?.data?.fileUploadEntity;
});

const modalName = "ModalUploadImages";
const uploadError = ref(false);

const emit = defineEmits(["upload-complete", "upload-error"]);

const UPLOAD_LIMITS = {
  "event-icon": 1,
  "group-carousel": 10,
  "group-icon": 1,
  "organization-carousel": 10,
  "organization-icon": 1,
} as const;

const uploadLimit = computed(
  () => UPLOAD_LIMITS[fileUploadEntity.value as keyof typeof UPLOAD_LIMITS] ?? 0
);

const entityId = computed(() => {
  switch (fileUploadEntity.value) {
    case "event-icon":
      return eventStore.event.id;
    case "group-carousel":
    case "group-icon":
      return groupStore.group.id;
    case "organization-carousel":
    case "organization-icon":
      return organizationStore.organization.id;
    default:
      return undefined;
  }
});

const handleUpload = async () => {
  if (!entityId.value || !fileUploadEntity.value) {
    throw new Error(
      `No entity ID found for fileUploadEntity: ${fileUploadEntity.value}`
    );
  }

  try {
    // uploadFiles adds file/s to imageUrls.value, which is a ref that can be used in the parent component from useFileManager().
    await uploadFiles(entityId.value, fileUploadEntity.value);

    const modals = useModals();
    modals.closeModal(modalName);

    emit("upload-complete", fileUploadEntity.value);
    uploadError.value = false;
  } catch (error) {
    console.error("Error uploading images:", error);
    emit("upload-error");
  }
};
</script>
