<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="relative" data-testid="image-carousel">
    <MediaImageCarousel
      @edit-images="handleEditUploadImage()"
      :entityType="entityType"
      :fullscreen="false"
      :imageUrls="imageUrls"
    />
    <button
      @click="
        openMediaImageCarousel({
          entityType: props.entityType,
          imageUrls,
        })
      "
      @keydown.enter="
        openMediaImageCarousel({
          entityType: props.entityType,
          imageUrls,
        })
      "
      :aria-label="
        $t('i18n.components.media_image_carousel_full.open_modal_aria_label')
      "
      class="absolute right-2 top-2 z-10 hidden rounded-lg border border-black/80 bg-white/80 p-1 text-black/80 focus-brand dark:border-white/80 dark:bg-black/80 dark:text-white/80 md:block"
    >
      <Icon class="-mb-1" :name="IconMap.FULL_SCREEN" size="1.5em" />
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  entityType: EntityType;
  entityId: string;
  images: ContentImage[];
}>();

const { openModal: openMediaImageCarousel } =
  useModalHandlers("ModalMediaImage");
const { openModal: openModalUploadImageOrganization } = useModalHandlers(
  "ModalUploadImageOrganization"
);
const { openModal: openModalUploadImageGroup } = useModalHandlers(
  "ModalUploadImageGroup"
);
const handleEditUploadImage = () => {
  if (props.entityType === EntityType.GROUP)
    openModalUploadImageGroup({
      groupId: props.entityId as unknown as Group,
    });
  if (props.entityType === EntityType.ORGANIZATION)
    openModalUploadImageOrganization({
      orgId: props.entityId as unknown as Organization,
    });
};

const { defaultImageUrls } = useFileManager();
const imageUrls = ref<string[]>([]);

watch(
  props,
  (newValue) => {
    if (newValue.images && newValue.images.length > 0) {
      imageUrls.value = newValue.images.map(
        (image: ContentImage) => `/api/${image.fileObject}`
      );
      return;
    }
    imageUrls.value = defaultImageUrls.value;
  },
  { immediate: true, deep: true }
);
</script>
