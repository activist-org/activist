<template>
  <MetaTag
    v-for="organization in organizations"
    iconName="IconOrganization"
    :value="organization"
  />
</template>

<script setup lang="ts">
defineProps<{
  organizations: string[];
}>();
</script>
