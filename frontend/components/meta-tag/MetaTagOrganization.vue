<template>
  <MetaTag iconName="IconOrganization" :value="organization" />
</template>

<script setup lang="ts">
defineProps<{
  organization: string;
}>();
</script>
