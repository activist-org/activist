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
        class="flex items-center justify-center bg-light-layer-2 dark:bg-dark-layer-2"
      >
        <img
          class="object-cover object-center"
          :class="{
            'h-5/6 w-5/6': props.fullscreen,
            'h-[17.5rem]': !props.fullscreen,
          }"
          :src="img"
          :alt="$t('components.media_image_carousel.img_alt_text')"
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
import { IconMap } from "~/types/icon-map";

const props = defineProps({
  fullscreen: Boolean,
});

register();

const colorMode = useColorMode();
const imageColor = colorMode.value;

const imageUrls = [
  `${GET_ACTIVE_IMAGE_URL}_${imageColor}.png`,
  `${GET_ORGANIZED_IMAGE_URL}_${imageColor}.png`,
  `${GROW_ORGANIZATION_IMAGE_URL}_${imageColor}.png`,
];
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
  @apply focus-brand  bg-light-cta-orange/80 dark:bg-dark-cta-orange/80;
}

swiper-container::part(bullet-active) {
  @apply focus-brand bg-light-cta-orange dark:bg-dark-cta-orange;
}
</style>
