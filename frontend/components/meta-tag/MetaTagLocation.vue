<template>
  <MetaTag iconName="ic:sharp-location-on" :value="location" />
</template>

<script setup lang="ts">
defineProps<{
  location: string;
  iconSize?: string;
}>();
</script>
