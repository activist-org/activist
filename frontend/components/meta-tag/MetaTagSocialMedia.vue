<template>
  <div
    class="flex items-center w-full h-full cursor-pointer gap-3"
  >
    <Icon :name="props.iconName" :size="props.iconSize" />
    <p :class="props.textStyleClass">{{ props.text }}</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
  iconName: string;
  text: string;
  iconSize: string;
  textStyleClass: string;
}>();
</script>
