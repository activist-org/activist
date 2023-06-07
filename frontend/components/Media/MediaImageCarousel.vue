<template>
  <swiper
    class="rounded-sm swiper sm:rounded-md"
    :modules="modules"
    :slides-per-view="1"
    :space-between="30"
    :loop="true"
    :pagination="{ clickable: true }"
    :navigation="true"
  >
    <swiper-slide
      v-for="n in 7"
      class="rounded-sm sm:rounded-md bg-light-placeholder dark:bg-dark-placeholder text-light-distinct dark:text-dark-distinct"
    >
      {{ n }}
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
  name: "swiper-example-loop",
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

<style scoped>
.swiper-slide {
  display: flex;
  height: 300px;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: 700;
}
</style>
