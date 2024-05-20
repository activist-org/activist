<template>
  <MetaTag :iconName="IconMap.VIDEO" :value="link" :label="label" />
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

defineProps<{
  link: string;
  label: string;
  iconSize?: string;
}>();
</script>
