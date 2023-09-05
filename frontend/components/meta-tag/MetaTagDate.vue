<template>
  <MetaTag iconName="bi:calendar-event" :value="date" />
</template>

<script setup lang="ts">
defineProps<{
  date: string;
}>();
</script>
