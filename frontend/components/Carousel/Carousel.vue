<template>
    <swiper :slides-per-view="1" :navigation="true">
      <swiper-slide v-for="n in 7" :key="n"> {{ n }} </swiper-slide>
    </swiper>
  </template>
  
  <style scoped>
  .swiper-slide {
    display: flex;
    height: 300px;
    justify-content: center;
    align-items: center;
    width: 50% !important;
    margin: 0 25%;
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
  <script>
  // Import Swiper Vue.js components
  import { Swiper } from "swiper/vue";
  import { SwiperSlide } from "swiper/vue";
  import SwiperCore, { Navigation } from "swiper";
  // Import Swiper styles
  import "swiper/css";
  import "swiper/css/navigation";
  SwiperCore.use([Navigation]);
  export default {
    components: {
      Swiper,
      SwiperSlide,
    },
  };
  </script>