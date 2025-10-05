<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <MetaTag :iconName="IconMap.DATE" :value="date" />
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

defineProps<{
  date: string;
  iconSize?: string;
}>();
</script>
