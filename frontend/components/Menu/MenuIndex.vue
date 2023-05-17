<template>
  <div class="flex flex-col items-center">
    <!-- TODO: Replace icon below with images.-->
    <Icon name="radix-icons:component-placeholder" size="2em" />
    <p>Name</p>
    <!-- TODO: Replace with a list that adds the buttons.-->
    <ul class="flex flex-col"></ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name?: string;
  menuType?: string; // `organization`, `event`, etc
}>();
</script>
