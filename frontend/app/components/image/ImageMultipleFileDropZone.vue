<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ImageFileDropZone
    v-if="localFiles.length !== uploadLimit"
    v-slot="{ isDropZoneActive }"
    @files-dropped="handleAdd"
  >
    <span v-if="isDropZoneActive && uploadLimit > 1">
      {{ $t("i18n.components.image_multiple_file_drop_zone.drop_images") }}
    </span>
    <span v-else-if="isDropZoneActive && uploadLimit === 1">
      {{ $t("i18n.components._global.drop_image") }}
    </span>
    <span v-else-if="!isDropZoneActive && uploadLimit > 1">
      {{ $t("i18n.components.image_multiple_file_drop_zone.drag_images") }}
    </span>
    <span v-else-if="!isDropZoneActive && uploadLimit === 1">
      {{ $t("i18n.components.image_multiple_file_drop_zone.drag_image") }}
    </span>
  </ImageFileDropZone>
  <p class="py-2">
    {{ $t("i18n.components.image_multiple_file_drop_zone.number_of_files") }}:
    {{ localFiles.length }}
  </p>
  <p
    v-if="uploadLimit === 1 && localFiles.length > uploadLimit"
    class="text-action-red"
  >
    {{ $t("i18n.components.image_multiple_file_drop_zone.picture_limit_1") }}
  </p>
  <p
    v-if="uploadLimit !== 1 && localFiles.length >= uploadLimit"
    class="text-action-red"
  >
    {{
      $t(
        "i18n.components.image_multiple_file_drop_zone.picture_limit_multiple",
        {
          limit: uploadLimit,
        }
      )
    }}
  </p>
  <div>
    <draggable
      v-model="localFiles"
      @change="emitFiles"
      animation="300"
      class="flex flex-row"
      ghost-class="opacity-0"
      tag="div"
    >
      <template #item="{ element: file }">
        <span class="pb-4">
          <button @click="handleRemoveFile(file)" class="text-action-red">
            <Icon :name="IconMap.X_SM" size="1.5em" />
          </button>
          <img
            :key="file?.type === 'upload' ? file?.data?.name : file?.data?.id"
            :alt="
              $t('i18n.components._global.upload_image') + ' ' + file.data.name
            "
            class="h-20 w-20 object-contain"
            :src="
              file?.type === 'upload'
                ? file?.data?.url
                : `/api/${file?.data?.fileObject}`
            "
          />
        </span>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import draggable from "vuedraggable";

interface Props {
  modelValue: FileUploadMix[];
  uploadLimit: number;
}
const props = defineProps<Props>();
const emit = defineEmits([
  "update:modelValue",
  "files-dropped",
  "file-deleted",
]);
const { handleAddFiles, removeFile } = useFileManager();

// Local copy of file.
const localFiles = ref<FileUploadMix[]>([]);

// Emit file changes.
/**
 * Emits the current state of the localFiles array to the parent component. This function is called whenever there is a change in the localFiles array, ensuring that the parent component always has the latest list of files. It emits the "update:modelValue" event with the current localFiles array as the payload.
 */
function emitFiles() {
  emit("update:modelValue", localFiles.value);
}

watch(
  props.modelValue,
  (newValue) => {
    localFiles.value = newValue;
  },
  { immediate: true }
);

/**
 * Handles the addition of files when they are dropped into the drop zone. This function takes an array of File objects as input, processes them using the handleAddFiles utility function to add them to the localFiles array, and then emits the updated list of files to the parent component. Additionally, it emits a "files-dropped" event with the updated list of files, allowing the parent component to react to the new files being added, such as by uploading them to the server or updating the UI accordingly.
 * @param files An array of File objects that have been dropped into the drop zone. These files are processed and added to the localFiles array, which is a local representation of the files being managed by this component. The function uses the handleAddFiles utility to handle the addition of these files, ensuring that they are properly integrated into the component's state before emitting the changes to the parent component.
 */
function handleAdd(files: File[]) {
  localFiles.value = handleAddFiles(files, localFiles.value); // this should mutate localFiles
  emitFiles();
  emit("files-dropped", localFiles.value);
}

/**
 * Handles the removal of a file from the localFiles array. This function takes a FileUploadMix object as input, removes it from the localFiles array using the removeFile utility function, and then emits the updated list of files to the parent component. Additionally, it emits a "file-deleted" event with the removed file, allowing the parent component to react to the file being deleted, such as by removing it from the server or updating the UI accordingly.
 * @param file The FileUploadMix object representing the file to be removed. This object contains information about the file, such as its type and data, which is used to identify and remove it from the localFiles array. The function uses the removeFile utility to handle the removal of this file, ensuring that it is properly removed from the component's state before emitting the changes to the parent component.
 */
function handleRemoveFile(file: FileUploadMix) {
  removeFile(localFiles.value, file.data);
  emitFiles();
  emit("file-deleted", file);
}
</script>
