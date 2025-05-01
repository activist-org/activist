<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="relative">
    <MediaImageCarousel
      @delete-complete="handleDeleteComplete"
      :fullscreen="false"
      :fileUploadEntity="props.fileUploadEntity"
      :imageUrls="imageUrls"
    />
    <button
      @click="openMediaImageCarousel()"
      @keydown.enter="openMediaImageCarousel()"
      class="focus-brand absolute right-2 top-2 z-10 hidden rounded-lg border border-black/80 bg-white/80 p-1 text-black/80 dark:border-white/80 dark:bg-black/80 dark:text-white/80 md:block"
    >
      <Icon :name="IconMap.FULL_SCREEN" size="1.5em" />
    </button>
    <ModalMediaImageCarousel
      @upload-complete="fetchOrganizationImages"
      @closeModal="handleCloseMediaImageCarousel"
      :imageUrls="imageUrls"
      :fileUploadEntity="props.fileUploadEntity"
    />
  </div>
</template>

<script setup lang="ts">
import { FileUploadEntity } from "~/types/content/file-upload-entity";
import { IconMap } from "~/types/icon-map";

const props = defineProps<{ fileUploadEntity: FileUploadEntity }>();

const orgStore = useOrganizationStore();
const groupStore = useGroupStore();

// TODO: Refactor this. ModalUploadImages also figures ids out.
// Needed here because of the useFileManager hook, to get the initial image set on mount.
const entityId = computed(() => {
  switch (props.fileUploadEntity) {
    case FileUploadEntity.ORGANIZATION_CAROUSEL:
      return orgStore.organization.id;
    case FileUploadEntity.GROUP_CAROUSEL:
      return groupStore.group.id;
    default:
      console.log("Invalid file upload entity: ", props.fileUploadEntity);
      return undefined;
  }
});

const {
  openModal: openMediaImageCarousel,
  handleCloseModal: handleCloseMediaImageCarousel,
} = useModalHandlers("ModalMediaImage");

const { imageUrls, fetchOrganizationImages } = useFileManager(entityId.value);

const handleDeleteComplete = async (fileUploadEntity: FileUploadEntity) => {
  const orgStore = useOrganizationStore();
  //   const groupStore = useGroupStore();
  //   const eventStore = useEventStore();
  //
  if (fileUploadEntity === FileUploadEntity.ORGANIZATION_CAROUSEL) {
    const { fetchOrganizationImages } = useFileManager(
      orgStore.organization.id
    );
    await fetchOrganizationImages();
  }
  if (fileUploadEntity === FileUploadEntity.ORGANIZATION_ICON) {
    console.log("OrganizationPage handleUploadComplete ORGANIZATION_ICON");
  }
};

onMounted(async () => {
  switch (props.fileUploadEntity) {
    case FileUploadEntity.ORGANIZATION_CAROUSEL:
      if (entityId.value) {
        await fetchOrganizationImages();
      }
      break;
    case FileUploadEntity.GROUP_CAROUSEL:
      return groupStore.group?.id;
    default:
      console.log("Invalid file upload entity: ", props.fileUploadEntity);
      return null;
  }
});
</script>
