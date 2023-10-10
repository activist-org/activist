<template>
  <div
    class="flex items-center justify-center w-full h-full card-style bg-light-placeholder dark:bg-dark-placeholder"
  >
    <div
      class="p-6 rounded-full md:p-8 bg-light-special-text dark:bg-dark-menu-selection"
    >
      <Icon
        name="bi:camera-video"
        :color="$colorMode.preference === 'dark' ? 'white' : 'black'"
        size="75px"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ link: string }>();
</script>
