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
          ariaLabel="i18n.components._global.upvote_application_aria_label"
          :cta="true"
          data-testid="upload-image-upload-button"
          :disabled="files.length === 0 || files.length > uploadLimit"
          fontSize="sm"
          iconSize="1.25em"
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
  orgId: string;
  uploadLimit?: number;
  images: ContentImage[];
}

const props = withDefaults(defineProps<Props>(), {
  uploadLimit: 10,
});
const orgId = computed(() => props.orgId);
const { data: organizationImages } = useGetOrganizationImages(orgId);
const { updateImage, uploadImages } = useOrganizationImageMutations(orgId);
const files = ref<FileUploadMix[]>([]);

watch(
  organizationImages,
  (newValueFilesImages) => {
    const images = (newValueFilesImages ?? []).map((image, index) => ({
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
          updateImage({
            ...image.data,
            sequence_index: image.sequence,
          } as ContentImage)
        )
      );
    }
    if (uploadFiles && uploadFiles.length > 0) {
      await uploadImages(
        uploadFiles.map((file) => file.data as UploadableFile),
        uploadFiles.map((file) => file.sequence)
      );
    }
    files.value = (organizationImages.value || []).map(
      (image: ContentImage, index: number) => ({
        type: "file",
        data: image,
        sequence: index,
      })
    ) as FileUploadMix[];
    modals.closeModal(modalName);
    emit("upload-complete", orgId.value);
    uploadError.value = false;
  } catch (error) {
    emit("upload-error");
    void error;
  }
};
</script>
