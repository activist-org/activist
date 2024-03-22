<template>
  <div
    class="card-style bg-light-placeholder dark:bg-dark-placeholder flex h-full w-full items-center justify-center"
  >
    <div
      class="bg-light-distinct-text dark:bg-dark-menu-selection rounded-full p-6 md:p-8"
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
