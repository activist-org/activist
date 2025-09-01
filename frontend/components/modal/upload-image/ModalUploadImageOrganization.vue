<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <div>
      <DialogTitle>
        <h2 v-if="uploadLimit > 1" class="font-bold">
          {{ $t("i18n.components.modal.upload_image._global.upload_images") }}
        </h2>
        <h2 v-else class="font-bold">
          {{ $t("i18n.components.modal.upload_image._global.upload_an_image") }}
        </h2>
      </DialogTitle>
      <div class="mt-4">
        <ImageMultipleFileDropZone
          @update:modelValue="(newFiles) => (files = newFiles)"
          :model-value="files"
          :uploadLimit="uploadLimit"
        />
        <BtnAction
          v-if="files.length > 0"
          @click="handleUpload"
          :cta="true"
          label="i18n.components._global.upload"
          fontSize="sm"
          :leftIcon="IconMap.ARROW_UP"
          iconSize="1.25em"
          ariaLabel="i18n.components._global.upvote_application_aria_label"
          :disabled="files.length === 0 || files.length > uploadLimit"
        />
      </div>
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import { DialogTitle } from "@headlessui/vue";

import type {
  ContentImage,
  FileUploadMix,
  UploadableFile,
} from "~/types/content/file";

import { IconMap } from "~/types/icon-map";

interface Props {
  entityId: string;
  uploadLimit?: number;
  images: ContentImage[];
}
const props = withDefaults(defineProps<Props>(), {
  uploadLimit: 10,
});

const organizationStore = useOrganizationStore();
const { organization } = useOrganizationStore();

const files = ref<FileUploadMix[]>([]);

watch(
  props,
  (newValueFilesImages) => {
    const images = (newValueFilesImages.images ?? []).map((image, index) => ({
      type: "file",
      data: image,
      sequence: index,
    })) as FileUploadMix[];
    files.value = images.concat(files.value);
    return;
  },
  { immediate: true, deep: true }
);

const modals = useModals();
const modalName = "ModalUploadImageOrganization";
const uploadError = ref(false);

const emit = defineEmits(["upload-complete", "upload-error"]);
// TODO: This is a lot of code, and it should be in a composable.
const handleUpload = async () => {
  try {
    const reIndexedFiles = files.value.map((file, index) => ({
      ...file,
      sequence: index,
    }));
    const uploadFiles = reIndexedFiles.filter((file) => file.type === "upload");
    const imageFiles = reIndexedFiles.filter((file) => file.type === "file");
    if (imageFiles && imageFiles.length > 0) {
      await Promise.all(
        imageFiles.map((image) =>
          organizationStore.updateImage(props.entityId, {
            ...image.data,
            sequence_index: image.sequence,
          } as ContentImage)
        )
      );
    }
    if (uploadFiles && uploadFiles.length > 0) {
      await organizationStore.uploadFiles(
        props.entityId,
        uploadFiles.map((file) => file.data as UploadableFile),
        uploadFiles.map((file) => file.sequence)
      );
    }
    files.value = (organization.images || []).map(
      (image: ContentImage, index: number) => ({
        type: "file",
        data: image,
        sequence: index,
      })
    ) as FileUploadMix[];
    modals.closeModal(modalName);
    emit("upload-complete", props.entityId);
    uploadError.value = false;
  } catch (error) {
    emit("upload-error");
    void error;
  }
};
</script>
