<template>
  <ImageFileDropZone
    v-if="localFiles.length !== uploadLimit"
    @files-dropped="handleAdd"
    v-slot="{ isDropZoneActive }"
  >
    <span v-if="isDropZoneActive && uploadLimit > 1">{{
      $t("i18n.components.image_multiple_file_drop_zone.drop_images")
    }}</span>
    <span v-else-if="isDropZoneActive && uploadLimit === 1">{{
      $t("i18n.components._global.drop_image")
    }}</span>
    <span v-else-if="!isDropZoneActive && uploadLimit > 1">{{
      $t("i18n.components.image_multiple_file_drop_zone.drag_images")
    }}</span>
    <span v-else-if="!isDropZoneActive && uploadLimit === 1">{{
      $t("i18n.components.image_multiple_file_drop_zone.drag_image")
    }}</span>
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
      tag="div"
      class="flex flex-row"
      animation="300"
      ghost-class="opacity-0"
    >
      <template #item="{ element: file }">
        <span class="pb-4">
          <button @click="handleRemoveFile(file)" class="text-action-red">
            <Icon :name="IconMap.X_SM" size="1.5em" />
          </button>
          <img
            :key="file?.type === 'upload' ? file?.data?.name : file?.data?.id"
            :src="
              file?.type === 'upload' ? file?.data?.url : file?.data?.fileObject
            "
            class="h-20 w-20 object-contain"
            :alt="
              $t('i18n.components._global.upload_image') + ' ' + file.data.name
            "
          />
        </span>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import draggable from "vuedraggable";

import type { FileUploadMix } from "~/types/content/file";

import { IconMap } from "~/types/icon-map";

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

// 1. Local copy
const localFiles = ref<FileUploadMix[]>([]);

// 3. Emit changes
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
function handleAdd(files: File[]) {
  localFiles.value = handleAddFiles(files, localFiles.value); // This should mutate localFiles
  emitFiles();
  emit("files-dropped", localFiles.value);
}

function handleRemoveFile(file: FileUploadMix) {
  removeFile(localFiles.value, file.data);
  emitFiles();
  emit("file-deleted", file);
}
</script>
