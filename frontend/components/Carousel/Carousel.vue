<template>
  <swiper
    class="swiper"
    :modules="modules"
    :slides-per-view="1"
    :space-between="30"
    :loop="true"
    :pagination="{ clickable: true }"
    :navigation="true"
  >
  <swiper-slide v-for="n in 7" :key="n"> {{ n }} </swiper-slide>
  </swiper>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { Pagination, Navigation } from 'swiper'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import 'swiper/css'
  import 'swiper/css/pagination'
  import 'swiper/css/navigation'

  export default defineComponent({
    name: 'swiper-example-loop',
    title: 'Loop mode / Infinite loop',
    url: import.meta.url,
    components: {
      Swiper,
      SwiperSlide
    },
    setup() {
      return {
        modules: [Pagination, Navigation]
      }
    }
  })
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
.swiper-slide:nth-child(1n) {
  background-color: palevioletred;
}
.swiper-slide:nth-child(2n) {
  background-color: skyblue;
}
.swiper-slide:nth-child(3n) {
  background-color: peru;
}
.swiper-slide:nth-child(4n) {
  background-color: cadetblue;
}
.swiper-slide:nth-child(5n) {
  background-color: plum;
}
.swiper-slide:nth-child(6n) {
  background-color: goldenrod;
}
.swiper-slide:nth-child(7n) {
  background-color: palegreen;
}
</style>