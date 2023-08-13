<template>
  <swiper
    class="w-full h-full swiper card-style"
    :modules="modules"
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
  </swiper>
</template>

<script lang="ts">
import { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/vue";
import { defineComponent } from "vue";

export default defineComponent({
  title: "Loop mode / Infinite loop",
  url: import.meta.url,
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    return {
      modules: [Pagination, Navigation],
    };
  },
});
</script>
