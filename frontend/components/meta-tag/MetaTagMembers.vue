<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <MetaTag
    :iconName="IconMap.PEOPLE"
    :value="`${categorizeNumber(members)}`"
    :label="label"
  />
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

defineProps<{
  members: number;
  label?: string;
  iconSize?: string;
}>();

function categorizeNumber(num: number): string {
  if (num < 10) {
    return "<10";
  } else {
    const lowerBound = Math.floor(num / 10) * 10;
    const upperBound = lowerBound + 10;
    return `${lowerBound}-${upperBound}`;
  }
}
</script>
