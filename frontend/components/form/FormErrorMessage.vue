<template>
  <div v-if="message" class="error-text">
    {{ props.message }}
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ message?: string }>();
</script>
