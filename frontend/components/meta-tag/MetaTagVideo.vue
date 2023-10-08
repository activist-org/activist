<template>
  <metatag iconName="bi:camera-video" :value="link" :label="label" />
</template>

<script setup lang="ts">
defineProps<{
  link: string;
  label: string;
}>();
</script>
