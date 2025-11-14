<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <MetaTag
    :iconName="IconMap.PERSON_CHECK"
    :label="label"
    :value="numAttending.toLocaleString()"
  />
</template>

<script setup lang="ts">

defineProps<{
  numAttending: number;
  label: string;
  iconSize?: string;
}>();
</script>
