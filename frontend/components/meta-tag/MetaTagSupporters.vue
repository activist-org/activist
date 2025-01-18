<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <MetaTag iconName="IconSupport" :value="String(supporters)" :label="label" />
</template>

<script setup lang="ts">
defineProps<{
  supporters: number;
  label: string;
  iconSize?: string;
}>();
</script>
