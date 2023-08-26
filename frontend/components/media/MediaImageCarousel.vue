<template>
  <swiper-container
    class="w-full h-full swiper card-style"
    :slides-per-view="1"
    :space-between="30"
    :loop="true"
    :pagination="{ clickable: true }"
    :navigation="true"
  >
    <swiper-slide
      v-for="n in 7"
      class="bg-light-placeholder dark:bg-dark-placeholder text-light-distinct dark:text-dark-distinct"
    >
      <p
        class="flex items-center justify-center h-full text-2xl font-bold select-none"
      >
        {{ n }}
      </p>
    </swiper-slide>
  </swiper-container>
</template>

<script setup lang="ts">
import { register } from "swiper/element/bundle";
register();
</script>

<style>
swiper-container::part(button-prev),
swiper-container::part(button-next) {
  @apply focus-brand text-light-cta-orange hover:text-light-cta-orange-hover dark:text-dark-cta-orange dark:hover:text-dark-cta-orange-hover;
}

swiper-container::part(bullet-active) {
  @apply focus-brand bg-light-cta-orange dark:bg-dark-cta-orange;
}

swiper-container::part(bullet) {
  @apply focus-brand hover:bg-light-cta-orange-hover dark:hover:bg-dark-cta-orange-hover;
}
</style>
