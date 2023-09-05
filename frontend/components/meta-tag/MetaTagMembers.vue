<template>
  <MetaTag iconName="bi:people" :value="String(members)" :label="label" />
</template>

<script setup lang="ts">
defineProps<{
  members: number;
  label: string;
}>();
</script>
