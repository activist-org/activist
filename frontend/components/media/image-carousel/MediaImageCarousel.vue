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
import { register } from "swiper/element/bundle";
import { useModalHandlers } from "~/composables/useModalHandlers";
import { IconMap } from "~/types/icon-map";

const props = defineProps({
  fullscreen: Boolean,
  organizationId: String,
  imageUrls: Array<string>,
});

register();

const uploadError = ref(false);

// Forward the upload-complete event to the parent component.
// Building out an event bus would be a better solution, but only a quick fix is needed here.
const emit = defineEmits(["upload-complete"]);
const forwardUploadCompleteEmit = () => {
  emit("upload-complete");
};

const {
  openModal: openModalUploadImages,
  handleCloseModal: handleCloseModalUploadImages,
} = useModalHandlers("ModalUploadImages");
</script>

<style>
swiper-container::part(bullet) {
  @apply mx-1 h-2 w-2 border-spacing-1 rounded-full bg-cta-orange/80 transition-opacity hover:opacity-100;
}

swiper-container::part(bullet-active) {
  @apply h-2 w-2 rounded-full bg-cta-orange opacity-100;
}
</style>
