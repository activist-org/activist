<template>
  <CardSearchResult
    :organization="organization"
    :isReduced="isReduced"
    :isPrivate="isPrivate"
  />
</template>

<script setup lang="ts">
import type { Organization } from "~/types/communities/organization";

defineProps<{
  organization: Organization;
  isPrivate?: boolean;
  isReduced?: boolean;
}>();
</script>
