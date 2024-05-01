<template>
  <ModalBase
    @closeModal="handleCloseModal"
    :isOpen="modalShouldClose == false ? modalIsOpen : false"
  >
    <div>
      <DialogTitle>
        <p class="responsive-h2 font-bold">
          {{ $t("components.modal-upload-images.upload-images") }}
        </p>
      </DialogTitle>
      <div class="mt-4">
        <ModalUploadImagesFileDropZone
          v-if="files.length != uploadLimit"
          @files-dropped="handleFiles"
          v-slot="{ isDropZoneActive }"
        >
          <span v-if="isDropZoneActive">{{
            $t("components.modal-upload-images.drop-images")
          }}</span>
          <span v-else>{{
            $t("components.modal-upload-images.drag-images")
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

const { files, handleFiles, removeFile } = useFileManager();

export interface Props {
  isOpen: boolean;
  uploadLimit?: number;
}

const props = withDefaults(defineProps<Props>(), {
  uploadLimit: 10,
});

const modalIsOpen = computed(() => props.isOpen);
const modalShouldClose = ref(false);

const emit = defineEmits(["closeModal"]);
const handleCloseModal = () => {
  modalShouldClose.value = true;
  emit("closeModal");
  modalShouldClose.value = false;
};
</script>
