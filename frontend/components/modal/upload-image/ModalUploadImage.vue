<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <div>
      <DialogTitle>
        <h2 v-if="uploadLimit > 1" class="font-bold">
          {{ $t("i18n.components.modal_upload_image.upload_images") }}
        </h2>
        <h2 v-else class="font-bold">
          {{ $t("i18n.components.modal.upload_image._global.upload_an_image") }}
        </h2>
      </DialogTitle>
      <div class="mt-4">
        <ImageFileDropZone
          v-if="files.length !== uploadLimit"
          @files-dropped="handleFiles"
          v-slot="{ isDropZoneActive }"
        >
          <span v-if="isDropZoneActive && uploadLimit > 1">{{
            $t("i18n.components.modal_upload_image.drop_images")
          }}</span>
          <span v-else-if="isDropZoneActive && uploadLimit === 1">{{
            $t("i18n.components.modal.upload_image._global.drop_image")
          }}</span>
          <span v-else-if="!isDropZoneActive && uploadLimit > 1">{{
            $t("i18n.components.modal_upload_image.drag_images")
          }}</span>
          <span v-else-if="!isDropZoneActive && uploadLimit === 1">{{
            $t("i18n.components.modal_upload_image.drag_image")
          }}</span>
        </ImageFileDropZone>
        <p class="py-2">
          {{ $t("i18n.components.modal_upload_image.number_of_files") }}:
          {{ files.length }}
        </p>
        <p
          v-if="uploadLimit === 1 && files.length > uploadLimit"
          class="text-action-red"
        >
          {{ $t("i18n.components.modal_upload_image.picture_limit_1") }}
        </p>
        <p
          v-if="uploadLimit !== 1 && files.length >= uploadLimit"
          class="text-action-red"
        >
          {{
            $t("i18n.components.modal_upload_image.picture_limit_multiple", {
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
                  @click="removeFile(files, file.data)"
                  class="text-action-red"
                >
                  <Icon :name="IconMap.X_SM" size="1.5em" />
                </button>
                <img
                  :key="file.type === 'upload' ? file.data.name : file.data.id"
                  :src="
                    file.type === 'upload'
                      ? file.data.url
                      : file.data.fileObject
                  "
                  class="h-20 w-20 object-contain"
                  :alt="
                    $t(
                      'i18n.components.modal.upload_image._global.upload_image'
                    ) +
                    ' ' +
                    file.data.name
                  "
                />
              </span>
            </template>
          </draggable>
          <BtnAction
            v-if="files.length > 0"
            @click="handleUpload"
            :cta="true"
            label="i18n.components.modal.upload_image._global.upload"
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

import type {
  ContentImage,
  FileImageMix,
  UploadableFile,
} from "~/types/content/file";

import { EntityType } from "~/types/entity";
import { IconMap } from "~/types/icon-map";

const { fileImages, handleFiles, removeFile } = useFileManager();
interface Props {
  entityType: EntityType;
  entityId: string;
  uploadLimit?: number;
  images: ContentImage[];
}
const props = withDefaults(defineProps<Props>(), {
  uploadLimit: 10,
});
const organizationStore = useOrganizationStore();

const files = ref<FileImageMix[]>([]);
watch(
  [fileImages, props],
  ([newValueFilesImages, newValuesImages]) => {
    if (
      newValuesImages.images &&
      newValuesImages.images.length > 0 &&
      files.value.length === 0
    ) {
      const images = newValuesImages.images.map((image) => ({
        type: "image",
        data: image,
      })) as FileImageMix[];
      files.value = images.concat(
        (newValueFilesImages || []).map((file) => ({
          type: "upload",
          data: file,
        }))
      );
      return;
    } else {
      const newFile = newValueFilesImages[newValueFilesImages.length - 1];
      if (newFile) {
        files.value.push({ type: "upload", data: newFile });
      }
    }
  },
  { immediate: true, deep: true }
);

const modals = useModals();
const modalName = "ModalUploadImage";
const uploadError = ref(false);

const emit = defineEmits(["upload-complete", "upload-error"]);

const handleUpload = async () => {
  try {
    // uploadFiles adds file/s to imageUrls.value, which is a ref that can be used in the parent component from useFileManager().
    if (props.entityType === EntityType.ORGANIZATION) {
      await organizationStore.uploadFiles(
        props.entityId,
        files.value
          .filter((file) => file.type === "upload")
          .map((file) => file.data as UploadableFile)
      );
    } else {
      throw new Error("Unsupported entity type");
    }

    modals.closeModal(modalName);

    emit("upload-complete", props.entityId);
    uploadError.value = false;
  } catch (error) {
    emit("upload-error");
    void error;
  }
};
</script>
