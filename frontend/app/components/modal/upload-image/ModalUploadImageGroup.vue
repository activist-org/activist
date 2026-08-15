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
          @file-deleted="handleFileDeleted"
          @update:modelValue="(newFiles) => (files = newFiles)"
          :model-value="files"
          :uploadLimit="uploadLimit"
        />
        <BtnAction
          v-if="files.length > 0"
          @click="handleUpload"
          ariaLabel="i18n.components._global.upvote_application_aria_label"
          :cta="true"
          :disabled="files.length === 0 || files.length > uploadLimit"
          fontSize="sm"
          iconSize="1.25em"
          :is-loading="loading"
          label="i18n.components._global.upload"
          :leftIcon="IconMap.ARROW_UP"
        />
      </div>
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import { DialogTitle } from "@headlessui/vue";

interface Props {
  groupId: string;
  uploadLimit?: number;
  images: ContentImage[];
}
const props = withDefaults(defineProps<Props>(), {
  uploadLimit: MAX_IMAGES_PER_UPLOAD,
});

const groupId = computed(() => props.groupId);

const modals = useModals();
const modalName = "ModalUploadImageGroup";
const uploadError = ref(false);

const { data: groupImages } = useGetGroupImages(groupId);
const { updateImageAsync, uploadImagesAsync, deleteImage, loading } =
  useGroupImageMutations(groupId);
const files = ref<FileUploadMix[]>([]);

// The drop zone only drops the entry from its list, so stored images are
// deleted here. Only server-side images (`type === "file"`) exist to delete.
const handleFileDeleted = async (file: FileUploadMix) => {
  if (file?.type !== "file") {
    return;
  }
  deleteImage(file.data.id);
};

watch(
  groupImages,
  (newValueFilesImages) => {
    const images = (newValueFilesImages ?? []).map((image, index) => ({
      type: "file",
      data: image,
      sequence: index,
    })) as FileUploadMix[];
    const pendingUploads = files.value.filter((f) => f.type === "upload");
    files.value = images.concat(pendingUploads);
    return;
  },
  { immediate: true, deep: true }
);

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
          updateImageAsync({
            ...image.data,
            sequence_index: image.sequence,
          } as ContentImage)
        )
      );
    }
    if (uploadFiles && uploadFiles.length > 0) {
      await uploadImagesAsync({
        images: uploadFiles.map((file) => file.data as UploadableFile),
        sequences: uploadFiles.map((file) => file.sequence),
      });
    }
    files.value = (groupImages.value || []).map(
      (image: ContentImage, index: number) => ({
        type: "file",
        data: image,
        sequence: index,
      })
    ) as FileUploadMix[];
    modals.closeModal(modalName);
    emit("upload-complete", groupId.value);
    uploadError.value = false;
  } catch (error) {
    emit("upload-error");
    void error;
  }
};
</script>
