<template>
  <metatag iconName="iconorganization" :value="organization" />
</template>

<script setup lang="ts">
defineProps<{
  organization: string;
}>();
</script>
