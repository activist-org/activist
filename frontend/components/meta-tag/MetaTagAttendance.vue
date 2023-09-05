<template>
  <MetaTag
    iconName="bi:person-fill-check"
    :value="String(numAttending)"
    :label="label"
  />
</template>

<script setup lang="ts">
defineProps<{
  numAttending: number;
  label: string;
}>();
</script>
