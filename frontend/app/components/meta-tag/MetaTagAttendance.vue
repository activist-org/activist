<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <MetaTag
    :iconName="IconMap.PERSON_CHECK"
    :value="numAttending.toLocaleString()"
    :label="label"
  />
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

defineProps<{
  numAttending: number;
  label: string;
  iconSize?: string;
}>();
</script>
