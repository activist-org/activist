<template>
  <CardSearchResult
    :resource="resource"
    :isReduced="isReduced"
    :isPrivate="isPrivate"
  />
</template>

<script setup lang="ts">
import type { Resource } from "~/types/content/resource";

defineProps<{
  resource: Resource;
  isPrivate?: boolean;
  isReduced?: boolean;
}>();
</script>
