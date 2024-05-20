<template>
  <MetaTag :iconName="IconMap.STAR" :value="String(stars)" :label="label" />
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

defineProps<{
  stars: number;
  label: string;
  iconSize?: string;
}>();
</script>
