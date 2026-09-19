<template>
  <div
    v-for="org in organizations"
    :key="org.id"
    class="space-y-6 pb-6 pt-3 md:pt-4"
  >
    <CardSearchResultEntityOrganization
      :isPrivate="false"
      :organization="org"
    />
  </div>
</template>
<script setup lang="ts">
defineProps<{
  organizations: Organization[];
}>();
</script>
