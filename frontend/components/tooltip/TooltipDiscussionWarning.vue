<template>
  <Tooltip
    :text="text"
    class="w-80 lg:right-0"
    >
    <ul class="list-disc pl-4 space-y-1">
      <li>Names</li>
      <li>Home addresses</li>
      <li>Phone numbers</li>
      <li>Email addresses</li>
    </ul>
  </Tooltip>
</template>

<script setup lang="ts">
import Tooltip from './Tooltip.vue';


const props = withDefaults(defineProps<{
  text?: string;
}>(), {
  text: 'Please use usernames and do NOT write any personal information including:'
});
</script>
