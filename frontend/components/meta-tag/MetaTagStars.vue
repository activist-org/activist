<template>
  <metatag iconName="bi:star" :value="string(stars)" :label="label" />
</template>

<script setup lang="ts">
defineProps<{
  stars: number;
  label: string;
}>();
</script>
