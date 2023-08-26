<template>
  <div @click="toggleExpand()" 
    class="flex flex-col gap-3 px-4 py-2 border rounded-md select-none border-light-section-div dark:border-dark-section-div bg-light-header dark:bg-dark-header active:bg-light-highlight dark:active:bg-dark-highlight">
    <div class="flex items-center gap-3">
      <Icon name="IconLegal" class="fill-light-text dark:fill-dark-text" />
      <p>Legal disclaimer</p>
      <Icon v-if="isOpen" name="bi:chevron-up" />
      <Icon v-else name="bi:chevron-down" />
    </div>
    <div v-show="isOpen" class="border-t border-light-section-div dark:border-dark-section-div">
      <p class="pt-2 select-text text-light-special-text dark:text-dark-special-text ">{{ disclaimer }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  disclaimer: string;
}>();

const isOpen = ref(false);
const toggleExpand = () => {
  isOpen.value = !isOpen.value;
};
</script>