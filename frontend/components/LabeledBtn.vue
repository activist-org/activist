<!--
v-if:width>0 "py-2 border rounded-md" and set the width
v-else:class="px-4 py-2 border rounded-md"
-->
<template>
  <div>
    <button
      class="px-4 py-2 border rounded-md select-none"
      :class="{
        'text-light-distinct-bg bg-light-cta-orange hover:bg-light-cta-orange-hover active:bg-light-cta-orange border-light-distinct-bg dark:text-dark-distinct-bg dark:bg-dark-cta-orange dark:hover:bg-dark-cta-orange-hover dark:active:bg-dark-cta-orange dark:border-dark-distinct-bg':
          cta == true,
        'bg-white hover:bg-gray-200 active:bg-white': cta == false,
      }"
    >
      {{ label }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  cta?: boolean;
  label: string;
  width?: number;
}>();
</script>
