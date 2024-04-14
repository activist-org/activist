<template>
  <MetaTag iconName="bi:people" :value="`${members}`" :label="label" />
</template>

<script setup lang="ts">
defineProps<{
  members: number;
  label?: string;
}>();
</script>
