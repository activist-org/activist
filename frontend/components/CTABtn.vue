<!--
v-if:width>0 "py-2 border rounded-md" and set the width
v-else:class="px-4 py-2 border rounded-md"
-->
<template>
  <div>
    <button
      class="px-4 py-2 border rounded-md select-none text-light-distinct-bg bg-light-cta-orange hover:bg-light-cta-orange-hover active:bg-light-cta-orange border-light-distinct-bg dark:text-dark-distinct-bg dark:bg-dark-cta-orange dark:hover:bg-dark-cta-orange-hover dark:active:bg-dark-cta-orange dark:border-dark-distinct-bg font-medium"
      :class="{
        'text-base': fontSize == 'base',
        'text-lg': fontSize == 'lg',
        'text-xl px-6 py-3': fontSize == 'xl',
        'text-2xl px-6 py-3': fontSize == '2xl',
        'text-3xl px-6 py-3': fontSize == '3xl',
      }"
    >
      {{ label }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  fontSize: string;
}>();
</script>
