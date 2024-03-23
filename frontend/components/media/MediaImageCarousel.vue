<template>
  <swiper-container
    class="swiper card-style h-full w-full overflow-clip"
    :slidesPerView="1"
    :spaceBetween="0"
    :loop="true"
    :pagination="{ clickable: true }"
  >
    <swiper-slide
      v-for="[idx, img] of imageUrls.entries()"
      :key="idx"
      class="bg-light-layer-2 dark:bg-dark-layer-2 flex items-center justify-center"
    >
      <img
        class="object-cover object-center"
        :class="[
          'w-4/5 h-4/5': props.fullscreen
          'h-[17.5rem]': !props.fullscreen,
        ]"
        :src="img"
        alt="Media image carousel"
      />
    </swiper-slide>
  </swiper-container>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { register } from "swiper/element/bundle";
register();

const props = defineProps({
  fullscreen: Boolean,
});

const colorMode = useColorMode();
const imageColor = colorMode.value;

const imageUrls = [
  `/images/content_pages/art/get_active_${imageColor}.png`,
  `/images/content_pages/art/get_organized_${imageColor}.png`,
  `/images/content_pages/art/grow_organization_${imageColor}.png`,
];
</script>

<style>
swiper-container::part(bullet) {
  @apply focus-brand  bg-light-cta-orange/80 dark:bg-dark-cta-orange/80;
}

swiper-container::part(bullet-active) {
  @apply focus-brand bg-light-cta-orange dark:bg-dark-cta-orange;
}
</style>
