<template>
  <MetaTag iconName="IconSupport" :value="String(supporters)" :label="label" />
</template>

<script setup lang="ts">
defineProps<{
  supporters: number;
  label: string;
}>();
</script>
