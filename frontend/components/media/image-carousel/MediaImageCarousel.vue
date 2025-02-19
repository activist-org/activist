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
        v-for="[idx, img] of imageUrls.entries()"
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
          :alt="$t(i18nMap.components.media_image_carousel.img_alt_text)"
        />
      </swiper-slide>
    </swiper-container>
    <p
      v-if="uploadError"
      class="absolute bottom-2 right-12 z-10 rounded bg-white/80 p-1 text-sm text-action-red dark:bg-black/80"
    >
      {{ $t(i18nMap.components.media_image_carousel.upload_error) }}
    </p>
    <button
      @click="openModal()"
      class="focus-brand absolute bottom-2 right-2 z-10 flex rounded-lg border border-black/80 bg-white/80 p-1 text-black/80 dark:border-white/80 dark:bg-black/80 dark:text-white/80"
    >
      <Icon :name="IconMap.PLUS" size="1.5em" />
    </button>
    <ModalUploadImages
      @closeModal="handleCloseModal"
      @upload-complete="fetchOrganizationImages"
      @upload-error="uploadError = true"
      :isOpen="modalIsOpen"
      :organizationId="organizationId"
    />
  </div>
</template>

<script setup lang="ts">
import { register } from "swiper/element/bundle";
import type { Swiper } from "swiper";
import { i18nMap } from "~/types/i18n-map";
import { IconMap } from "~/types/icon-map";

const props = defineProps({
  fullscreen: Boolean,
  organizationId: String,
});

register();

const colorMode = useColorMode();
const imageColor = colorMode.value;

const defaultImageUrls = [
  `${GET_ACTIVE_IMAGE_URL}_${imageColor}.png`,
  `${GET_ORGANIZED_IMAGE_URL}_${imageColor}.png`,
  `${GROW_ORGANIZATION_IMAGE_URL}_${imageColor}.png`,
];

const imageUrls = ref(defaultImageUrls);
const swiperRef = ref<{ swiper: Swiper | null }>(null);
const modals = useModals();
const modalName = "ModalUploadImages";
const modalIsOpen = ref(false);
const uploadError = ref(false);

// Use this to get rid of 'any' type in imageUrls.value data.map function
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

function openModal() {
  modals.openModal(modalName);
  modalIsOpen.value = modals.modals[modalName].isOpen;
}

const handleCloseModal = () => {
  modals.closeModal(modalName);
  modalIsOpen.value = modals.modals[modalName].isOpen;
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
