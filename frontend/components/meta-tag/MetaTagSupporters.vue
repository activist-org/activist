<template>
  <metatag iconName="iconsupport" :value="string(supporters)" :label="label" />
</template>

<script setup lang="ts">
defineProps<{
  supporters: number;
  label: string;
}>();
</script>
