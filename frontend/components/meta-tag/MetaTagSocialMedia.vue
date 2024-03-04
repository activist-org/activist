<template>
  <div
    class="cursor-pointer w-full h-full flex gap-2 content-center text-light-text dark:text-dark-text hover:text-light-distinct-text dark:hover:dark-distinct-text"
  >
    <Icon :name="props.iconName" size="1.5em" />
    <p>{{ props.text }}</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
  iconName: string;
  text: string;
}>();
</script>
