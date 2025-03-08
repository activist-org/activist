<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="relative">
    <!-- MediaImageCarousel is the main image display component. -->
    <!-- 'fullscreen' just makes the images a bit bigger in the carousel. -->
    <MediaImageCarousel
      @upload-complete="fetchOrganizationImages"
      :fullscreen="false"
      :organizationId="organizationId"
      :imageUrls="imageUrls"
    />
    <button
      @click="openMediaImageCarousel()"
      @keydown.enter="openMediaImageCarousel()"
      class="focus-brand absolute right-2 top-2 z-10 hidden rounded-lg border border-black/80 bg-white/80 p-1 text-black/80 dark:border-white/80 dark:bg-black/80 dark:text-white/80 md:block"
    >
      <Icon :name="IconMap.FULL_SCREEN" size="1.5em" />
    </button>
    <!-- ModalMediaImageCarousel is the full-screen/modal/popup. -->
    <ModalMediaImageCarousel
      @upload-complete="fetchOrganizationImages"
      @closeModal="handleCloseMediaImageCarousel"
      :imageUrls="imageUrls"
    />
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";
import { useModalHandlers } from "~/composables/useModalHandlers";
import type { Swiper } from "swiper/types";

const {
  openModal: openMediaImageCarousel,
  handleCloseModal: handleCloseMediaImageCarousel,
} = useModalHandlers("ModalMediaImage");

const props = defineProps<{
  organizationId?: string;
}>();

onMounted(() => {
  fetchOrganizationImages();
  const swiperEl = document.querySelector("swiper-container");
  if (swiperEl) {
    swiperRef.value = { swiper: swiperEl.swiper };
    swiperEl.addEventListener("swiper-ready", () => {
      swiperRef.value = { swiper: swiperEl.swiper };
    });
  }
});

// TODO: All image-related logic could be moved to a composable / store.
const colorMode = useColorMode();
const imageColor = colorMode.value;

const defaultImageUrls = [
  `${GET_ACTIVE_IMAGE_URL}_${imageColor}.png`,
  `${GET_ORGANIZED_IMAGE_URL}_${imageColor}.png`,
  `${GROW_ORGANIZATION_IMAGE_URL}_${imageColor}.png`,
];

const imageUrls = ref(defaultImageUrls);
const uploadError = ref(false);
const swiperRef = ref<{ swiper: Swiper | null }>();

interface OrganizationImage {
  id: string;
  fileObject: string;
  creation_date: string;
}

async function fetchOrganizationImages() {
  if (props.organizationId) {
    try {
      const response = await fetch(
        `${BASE_BACKEND_URL}/communities/organizations/${props.organizationId}/images/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          imageUrls.value = data.map(
            (img: OrganizationImage) => img.fileObject
          );
          uploadError.value = false;
        } else {
          imageUrls.value = defaultImageUrls;
        }
      } else {
        uploadError.value = true;
      }
    } catch (error) {
      console.error("Error fetching organization images:", error);
      uploadError.value = true;
    }
  }
}
</script>
