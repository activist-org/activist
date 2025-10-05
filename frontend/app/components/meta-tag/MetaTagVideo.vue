<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
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
