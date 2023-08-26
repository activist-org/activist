<template>
  <div
    class="w-full h-full card-style bg-light-placeholder dark:bg-dark-placeholder flex justify-center items-center"
  >
    <div
      class="p-6 md:p-8 bg-light-special-text dark:bg-dark-menu-selection rounded-full"
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
