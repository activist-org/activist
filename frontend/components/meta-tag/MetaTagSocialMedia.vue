<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="group flex h-full w-full cursor-pointer items-center gap-3">
    <Icon
      class="text-distinct-text group-hover:text-primary-text"
      :name="props.iconName"
      :size="props.iconSize ? props.iconSize : '1em'"
    />
    <p
      class="text-distinct-text group-hover:text-primary-text"
      :class="props.textUtilityClasses"
    >
      {{ props.text }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  iconName: string;
  text: string;
  iconSize?: string;
  textUtilityClasses?: string;
}>();
</script>
