<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <div>
      <DialogTitle>
        <h2 class="font-bold">
          {{ $t("i18n.components.modal.upload_image._global.upload_an_image") }}
        </h2>
      </DialogTitle>
      <div class="mt-4">
        <ImageFileDropZone
          v-if="fileImageIcon ? false : true"
          @files-dropped="(file) => handleFiles(file, true)"
        >
          <span>{{
            $t("i18n.components.modal.upload_image._global.drop_image")
          }}</span>
        </ImageFileDropZone>
        <div class="mb-4">
          <span v-if="fileImageIcon" class="relative block pb-4">
            <button
              @click="removeFileImageIcon()"
              class="absolute right-0 top-0 z-10 text-action-red"
            >
              <Icon :name="IconMap.X_SM" size="1.5em" />
            </button>
            <img
              :key="fileImageIcon.name"
              :src="fileImageIcon.url"
              class="h-[50%] w-[50%] object-contain"
              :alt="
                $t('i18n.components.modal.upload_image._global.upload_image') +
                ' ' +
                fileImageIcon.name
              "
            />
          </span>
        </div>
        <div>
          <BtnAction
            v-if="fileImageIcon"
            @click="handleUpload"
            :cta="true"
            label="i18n.components.modal.upload_image._global.upload"
            fontSize="sm"
            :leftIcon="IconMap.ARROW_UP"
            iconSize="1.25em"
            ariaLabel="i18n.components._global.upvote_application_aria_label"
            :disabled="!fileImageIcon"
          />
        </div>
      </div>
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import { DialogTitle } from "@headlessui/vue";

import type { UploadableFile } from "~/types/content/file";

import { EntityType } from "~/types/entity";
import { IconMap } from "~/types/icon-map";

const modals = useModals();
const modalName = "ModalUploadImageIcon";
const uploadError = ref(false);

const { fileImageIcon, handleFiles, removeFileImageIcon } = useFileManager();

interface Props {
  entityId: string;
  entityType: EntityType;
}

const props = defineProps<Props>();

const eventStore = useEventStore();
const organizationStore = useOrganizationStore();
const emit = defineEmits(["upload-complete", "upload-error"]);

const handleUpload = async () => {
  try {
    // uploadFiles adds file/s to imageUrls.value, which is a ref that can be used in the parent component from useFileManager().
    if (props.entityType === EntityType.ORGANIZATION) {
      await organizationStore.uploadIconImage(
        props.entityId,
        fileImageIcon.value as UploadableFile
      );
    } else if (props.entityType === EntityType.EVENT) {
      await eventStore.uploadIconImage(
        props.entityId,
        fileImageIcon.value as UploadableFile
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
