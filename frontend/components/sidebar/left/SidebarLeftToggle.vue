<template>
  <div class="hover:text-primary-text text-distinct-text rounded-md">
    <Icon
      v-if="chevronDirection == 'left'"
      :name="IconMap.CHEVRON_BAR_LEFT"
      :size="iconSize"
    />
    <Icon
      v-if="chevronDirection == 'right'"
      :name="IconMap.CHEVRON_BAR_RIGHT"
      :size="iconSize"
    />
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

defineProps<{
  chevronDirection: "left" | "right";
  iconSize: string;
}>();
</script>
