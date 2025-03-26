<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="relative">
    <MediaImageCarousel
      @upload-complete="fetchOrganizationImages"
      :fullscreen="false"
      :organizationId="organizationId"
      :imageUrls="imageUrls"
    />
    <button
      @click="openMediaImageCarousel"
      @keydown.enter="openMediaImageCarousel"
      class="focus-brand absolute right-2 top-2 z-10 hidden rounded-lg border border-black/80 bg-white/80 p-1 text-black/80 dark:border-white/80 dark:bg-black/80 dark:text-white/80 md:block"
    >
      <Icon :name="IconMap.FULL_SCREEN" size="1.5em" />
    </button>
    <ModalMediaImageCarousel
      @upload-complete="fetchOrganizationImages"
      @closeModal="handleCloseMediaImageCarousel"
      :imageUrls="imageUrls"
    />
  </div>
</template>

<script setup lang="ts">
import type { Swiper } from "swiper/types";

import { useModalHandlers } from "~/composables/useModalHandlers";
import { useOrganizationImages } from "~/composables/useOrganizationImages";
import { IconMap } from "~/types/icon-map";

const props = defineProps<{ organizationId?: string }>();

const {
  openModal: openMediaImageCarousel,
  handleCloseModal: handleCloseMediaImageCarousel,
} = useModalHandlers("ModalMediaImage");
const { imageUrls, fetchOrganizationImages } = useOrganizationImages(
  props.organizationId
);

const swiperRef = ref<{ swiper: Swiper | null }>();

function setupSwiper() {
  const swiperEl = document.querySelector("swiper-container");
  if (swiperEl) {
    swiperRef.value = { swiper: swiperEl.swiper };
    swiperEl.addEventListener("swiper-ready", () => {
      swiperRef.value = { swiper: swiperEl.swiper };
    });
  }
}

onMounted(() => {
  fetchOrganizationImages();
  setupSwiper();
});
</script>
