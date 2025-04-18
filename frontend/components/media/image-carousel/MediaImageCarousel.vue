<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="relative">
    <swiper-container
      ref="swiperRef"
      class="swiper card-style h-full w-full cursor-pointer overflow-clip"
      :slidesPerView="1"
      :spaceBetween="0"
      :loop="true"
      :keyboard="true"
      :pagination="{ clickable: true }"
    >
      <swiper-slide
        v-for="[idx, img] of imageUrls?.entries()"
        :key="idx"
        class="swiper-zoom-container flex items-center justify-center bg-layer-2"
      >
        <img
          class="object-cover object-center"
          :class="{
            'h-5/6 w-5/6': props.fullscreen,
            'h-[17.5rem]': !props.fullscreen,
          }"
          :src="img"
          :alt="$t('i18n.components.media_image_carousel.img_alt_text')"
        />
      </swiper-slide>
    </swiper-container>
    <p
      v-if="uploadError"
      class="absolute bottom-2 right-12 z-10 rounded bg-layer-0/80 p-1 text-sm text-action-red"
    >
      {{ $t("i18n.components.media_image_carousel.upload_error") }}
    </p>
    <button
      @click="handleDeleteClick"
      class="focus-brand absolute bottom-12 right-2 z-10 flex rounded-lg border border-black/80 bg-white/80 p-1 text-black/80 dark:border-white/80 dark:bg-black/80 dark:text-white/80"
    >
      <Icon :name="IconMap.MINUS" size="1.5em" />
    </button>
    <button
      @click="openModalUploadImages()"
      class="focus-brand absolute bottom-2 right-2 z-10 flex rounded-lg border border-black/80 bg-white/80 p-1 text-black/80 dark:border-white/80 dark:bg-black/80 dark:text-white/80"
    >
      <Icon :name="IconMap.PLUS" size="1.5em" />
    </button>
    <ModalUploadImages
      @upload-complete="forwardUploadCompleteEmit"
      @closeModal="handleCloseModalUploadImages"
      @upload-error="uploadError = true"
      :organizationId="organizationId"
    />
  </div>
</template>

<script setup lang="ts">
import type { Swiper as SwiperInstance } from "swiper";

import { register } from "swiper/element/bundle";

import { IconMap } from "~/types/icon-map";

const { deleteImage } = useOrganizationImages();

const props = defineProps({
  fullscreen: Boolean,
  organizationId: String,
  imageUrls: Array<string>,
});

register();

const uploadError = ref(false);
const currentImageId = ref<string>("");

const {
  openModal: openModalUploadImages,
  handleCloseModal: handleCloseModalUploadImages,
} = useModalHandlers("ModalUploadImages");

// Get the swiper instance. Use this instance to listen for the slideChange event.
const swiperRef = ref<{ swiper?: SwiperInstance } | null>(null);

onMounted(() => {
  const swiperEl = swiperRef.value;
  // Now we assert swiperRef value is a Swiper instance.
  if (swiperEl?.swiper) {
    swiperEl.swiper.on("slideChange", () => {
      const activeIndex = swiperEl?.swiper?.realIndex ?? 1;
      const img = (props.imageUrls ?? [])[activeIndex];

      if (img) {
        const regex = /\/([a-f0-9-]{36})\.jpg$/;
        const uuid = img.match(regex);
        if (uuid) {
          currentImageId.value = uuid[1];
        }
      }
    });
  }
});

onUpdated(() => {
  const swiperEl = swiperRef.value;
  if (swiperEl?.swiper) {
    swiperEl.swiper.update();
  }
});

const emit = defineEmits(["upload-complete", "delete-complete"]);

// Forward the upload-complete from ModalUploadImages event to the parent component.
// Building out an event bus would be a better solution, but only a quick fix is needed here.
const forwardUploadCompleteEmit = () => {
  emit("upload-complete");
};

const handleDeleteClick = async () => {
  try {
    await deleteImage(currentImageId.value);

    // Update Swiper after deleting an image.
    const swiper = swiperRef.value?.swiper;
    swiper?.update();

    emit("delete-complete");
  } catch (error) {
    console.error("Delete image failed:", error);
  }
};
</script>

<style>
swiper-container::part(bullet) {
  @apply mx-1 h-2 w-2 border-spacing-1 rounded-full bg-cta-orange/80 transition-opacity hover:opacity-100;
}

swiper-container::part(bullet-active) {
  @apply h-2 w-2 rounded-full bg-cta-orange opacity-100;
}
</style>
