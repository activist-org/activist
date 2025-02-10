<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="relative">
    <swiper-container
      class="swiper card-style h-full w-full cursor-pointer overflow-clip"
      :slidesPerView="1"
      :spaceBetween="0"
      :loop="true"
      :pagination="{ clickable: true }"
      :keyboard="true"
    >
      <swiper-slide
        v-for="[idx, img] of imageUrls.entries()"
        :key="idx"
        class="flex items-center justify-center bg-layer-2"
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
    <button
      @click="openModal()"
      class="focus-brand absolute bottom-2 right-2 z-10 flex rounded-lg border border-black/80 bg-white/80 p-1 text-black/80 dark:border-white/80 dark:bg-black/80 dark:text-white/80"
    >
      <Icon :name="IconMap.PLUS" size="1.5em" />
    </button>
    <ModalUploadImages @closeModal="handleCloseModal" :isOpen="modalIsOpen" />
  </div>
</template>

<script setup lang="ts">
import { register } from "swiper/element/bundle";
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
const modals = useModals();
const modalName = "ModalUploadImages";
const modalIsOpen = ref(false);

async function fetchOrganizationImages() {
  if (props.organizationId) {
    const response = await fetch(
      `${BASE_BACKEND_URL}/communities/organizations/${props.organizationId}/images/`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    console.log("ASDFASDFASFD response", response);

    if (response.ok) {
      const data = await response.json();
      console.log("data", data);
      if (data.length > 0) {
        imageUrls.value = data.map((img: any) => img.fileLocation);
      } else {
        imageUrls.value = defaultImageUrls;
      }
    }
  }
}

onMounted(() => {
  fetchOrganizationImages();
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
  @apply rounded-sm bg-cta-orange/80 focus:outline-none focus-visible:border-link-text focus-visible:ring-2 focus-visible:ring-link-text;
}

swiper-container::part(bullet-active) {
  @apply rounded-sm bg-cta-orange focus:outline-none focus-visible:border-link-text focus-visible:ring-2 focus-visible:ring-link-text;
}
</style>
