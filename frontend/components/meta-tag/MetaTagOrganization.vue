<template>
  <div v-for="organization in organizations">
    <MetaTag iconName="IconOrganization" :value="organization" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  organizations: string[];
}>();
</script>
