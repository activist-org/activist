<template>
  <Tooltip :text="text" class="w-96 lg:right-0">
    <ul class="list-disc pl-4 space-y-1">
      <li>{{ $t('components.tooltip-discussion-warning.names') }}</li>
      <li>{{ $t('components.tooltip-discussion-warning.home-addresses') }}</li>
      <li>{{ $t('components.tooltip-discussion-warning.phone-numbers') }}</li>
      <li>{{ $t('components.tooltip-discussion-warning.email-addresses') }}</li>
    </ul>
  </Tooltip>
</template>

<script setup lang="ts">
import Tooltip from './Tooltip.vue';


withDefaults(defineProps<{
  text?: string;
}>(), {
  text: $t('components.tooltip-discussion-warning.text')
});
</script>
