<template>
    <div class="flex flex-col responsive-px-2 responsive-py-1 rounded shadow-md shadow-zinc-700 bg-light-distinct dark:bg-dark-distinct w-max text-light-content dark:text-dark-content tooltip">
        <slot name="header">
          <div class="responsive-h4 text-light-text dark:text-dark-text" v-if="header">{{ header }}</div>
        </slot>
        <slot name="text">
          <div class="responsive-h5 text-light-text dark:text-dark-text" v-if="text">{{ text }}</div>
        </slot>
        <slot name="button" class="block"></slot>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue';
  
  defineProps<{
    header: string | null;
    text: string | null;
  }>();
  </script>
  