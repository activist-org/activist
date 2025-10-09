<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <MetaTag iconName="IconSupport" :label="label" :value="String(supporters)" />
</template>

<script setup lang="ts">
defineProps<{
  supporters: number;
  label: string;
  iconSize?: string;
}>();
</script>
