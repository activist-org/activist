<template>
  <!-- Note: mobile view -->
  <div
    class="md:hidden w-full h-full card-style bg-light-placeholder dark:bg-dark-placeholder flex justify-center items-center"
  >
    <div
      class="p-6 bg-light-special-text dark:bg-dark-menu-selection rounded-full"
    >
      <IconCameraVideo
        width="75px"
        height="75px"
        :fill="$colorMode.preference === 'dark' ? 'white' : 'black'"
      />
    </div>
  </div>
  <!-- Note: desktop view -->
  <div
    class="hidden md:flex w-full h-full card-style bg-light-placeholder dark:bg-dark-placeholder justify-center items-center"
  >
    <div
      class="p-8 bg-light-special-text dark:bg-dark-menu-selection rounded-full"
    >
      <IconCameraVideo
        :fill="$colorMode.preference === 'dark' ? 'white' : 'black'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ link: string }>();
</script>
