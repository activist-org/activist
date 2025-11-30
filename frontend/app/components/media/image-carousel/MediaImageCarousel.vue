<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="relative">
    <swiper-container
      ref="swiperRef"
      class="swiper card-style h-full w-full cursor-pointer overflow-clip"
      :keyboard="true"
      :loop="true"
      :pagination="{ clickable: true }"
      :slidesPerView="1"
      :spaceBetween="0"
    >
      <swiper-slide
        v-for="[idx, img] of imageUrls?.entries()"
        :key="idx"
        class="swiper-zoom-container flex items-center justify-center bg-layer-2"
      >
        <img
          :alt="$t('i18n.components.media_image_carousel.img_alt_text')"
          class="object-cover object-center"
          :class="{
            'h-5/6 w-5/6': props.fullscreen,
            'h-[17.5rem]': !props.fullscreen,
          }"
          :src="img"
        />
      </swiper-slide>
    </swiper-container>
    <p
      v-if="uploadError"
      class="absolute bottom-2 right-12 z-10 rounded bg-layer-0/80 p-1 text-sm text-action-red"
    >
      {{ $t("i18n.components.media_image_carousel.upload_error") }}
    </p>
    <IconEdit
      @click="handleOpenModalUploadImage()"
      :aria-label="
        $t('i18n.components.media_image_carousel.edit_images_aria_label')
      "
      class="absolute bottom-2 right-2 z-10 flex rounded-lg border border-black/80 bg-white/80 p-1 text-black/80 focus-brand dark:border-white/80 dark:bg-black/80 dark:text-white/80"
    />
  </div>
</template>

<script setup lang="ts">
import type { Swiper as SwiperInstance } from "swiper";

import { register } from "swiper/element/bundle";

interface Props {
  fullscreen: boolean;
  imageUrls: string[];
  entityType: EntityType;
}

const props = defineProps<Props>();

register();

const uploadError = ref(false);
const currentImageId = ref<string>("");
const { openModal: openModalUploadImageOrganization } = useModalHandlers(
  "ModalUploadImageOrganization"
);
const { openModal: openModalUploadImageGroup } = useModalHandlers(
  "ModalUploadImageGroup"
);
const handleOpenModalUploadImage = () => {
  if (props.entityType === EntityType.GROUP) openModalUploadImageGroup();
  if (props.entityType === EntityType.ORGANIZATION)
    openModalUploadImageOrganization();
};
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
          currentImageId.value = uuid[1] ?? "";
        }
      }
    });
  }
});
</script>

<style scoped>
@reference "../../../assets/css/tailwind.css";
swiper-container::part(bullet) {
  @apply mx-1 h-2 w-2 border-spacing-1 rounded-full bg-cta-orange/80 transition-opacity hover:opacity-100;
}

swiper-container::part(bullet-active) {
  @apply h-2 w-2 rounded-full bg-cta-orange opacity-100;
}
</style>
