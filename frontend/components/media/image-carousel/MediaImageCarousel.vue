<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="relative">
    <swiper-container
      class="swiper card-style h-full w-full cursor-pointer overflow-clip"
      :slidesPerView="1"
      :spaceBetween="0"
      :loop="true"
      :keyboard="true"
      ref="swiperRef"
    >
      <swiper-slide
        v-for="[idx, img] of imageUrls.entries()"
        :key="idx"
        class="flex items-center justify-center bg-layer-2 py-4"
      >
        <img
          class="object-cover object-center"
          :class="{
            'h-4/5 w-4/5': props.fullscreen,
            'h-[15rem]': !props.fullscreen,
          }"
          :src="img"
          :alt="$t(i18nMap.components.media_image_carousel.img_alt_text)"
        />
      </swiper-slide>
    </swiper-container>
    <div
      class="absolute bottom-0 left-0 right-0 z-[5] flex justify-center gap-8 bg-black/50 px-4 py-2"
    >
      <button @click="prev" class="text-white hover:text-gray-300">
        Previous
      </button>
      <button @click="next" class="text-white hover:text-gray-300">Next</button>
    </div>
    <button
      @click="openModal()"
      class="focus-brand absolute bottom-2 right-2 z-10 flex rounded-lg border border-black/80 bg-white/80 p-1 text-black/80 dark:border-white/80 dark:bg-black/80 dark:text-white/80"
    >
      <Icon :name="IconMap.PLUS" size="1.5em" />
    </button>
    <ModalUploadImages
      @closeModal="handleCloseModal"
      @upload-complete="fetchOrganizationImages"
      :isOpen="modalIsOpen"
      :organizationId="organizationId"
    />
  </div>
</template>

<script setup lang="ts">
import { register } from "swiper/element/bundle";
import { Swiper } from "swiper";
import { i18nMap } from "~/types/i18n-map";
import { IconMap } from "~/types/icon-map";

const props = defineProps({
  fullscreen: Boolean,
  organizationId: String,
});

register();

const imageUrls = ref<string[]>([]);
const swiperRef = ref<{ swiper: Swiper | null }>(null);

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
    if (response.ok) {
      const data = await response.json();
      imageUrls.value = data.map((img: any) => img.fileLocation);
    }
  }
}

onMounted(() => {
  fetchOrganizationImages();
});

function next() {
  swiperRef.value?.swiper?.slideNext();
}

function prev() {
  swiperRef.value?.swiper?.slidePrev();
}

// TODO: Update this to use the new modal handling in the modal store.
const modals = useModals();
const modalName = "ModalUploadImages";
const modalIsOpen = ref(false);

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
  @apply mx-1 h-3 w-3 rounded-full bg-white opacity-50;
}

swiper-container::part(bullet-active) {
  @apply h-3 w-3 rounded-full bg-white opacity-100;
}
</style>
