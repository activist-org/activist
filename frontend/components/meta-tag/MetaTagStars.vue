<template>
  <MetaTag iconName="bi:star" :value="String(stars)" :label="label" />
</template>

<script setup lang="ts">
defineProps<{
  stars: number;
  label: string;
}>();
</script>
