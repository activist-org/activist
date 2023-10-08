<template>
  <metatag
    iconName="bi:person-fill-check"
    :value="string(numAttending)"
    :label="label"
  />
</template>

<script setup lang="ts">
defineProps<{
  numAttending: number;
  label: string;
}>();
</script>
