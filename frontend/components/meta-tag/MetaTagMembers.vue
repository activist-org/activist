<template>
  <metatag iconName="bi:people" :value="string(members)" :label="label" />
</template>

<script setup lang="ts">
defineProps<{
  members: number;
  label: string;
}>();
</script>
