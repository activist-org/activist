<template>
  <MetaTag
    iconName="bi:person-fill-check"
    :value="numAttending.toLocaleString()"
    :label="label"
  />
</template>

<script setup lang="ts">
defineProps<{
  numAttending: number;
  label: string;
  iconSize?: string;
}>();
</script>
