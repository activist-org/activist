<template>
  <div ref="ignore">
    <button class="relative group z-50" @click="$emit('toggle')">
      <div
        class="relative flex items-center justify-center w-[35px] h-[27px] transform transition-all bg-transparent duration-200">
        <span
          class="w-full h-1 bg-light-menu-selection dark:bg-dark-menu-selection rounded-full absolute left-0 top-0 transition-all ease-in-out duration-250 transform"
          :class="{ 'opacity-0': isMenuOpen }"></span>
        <span
          class="w-full h-1 bg-light-menu-selection dark:bg-dark-menu-selection rounded-full absolute left-0 top-1/2 transition-all ease-in-out duration-250 transform -translate-y-1/2"
          :class="{ 'rotate-45': isMenuOpen }"></span>
        <span
          class="w-full h-1 bg-light-menu-selection dark:bg-dark-menu-selection rounded-full absolute left-0 top-1/2 transition-all ease-in-out duration-250 transform -translate-y-1/2"
          :class="{ '-rotate-45': isMenuOpen }"></span>
        <span
          class="w-full h-1 bg-light-menu-selection dark:bg-dark-menu-selection rounded-full absolute left-0 bottom-0 transition-all ease-in-out duration-250 transform"
          :class="{ 'opacity-0': isMenuOpen }"></span>
      </div>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  isMenuOpen: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(['toggle']);
</script>