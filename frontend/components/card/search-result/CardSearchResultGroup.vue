<template>
  <CardSearchResult
    :group="group"
    :isReduced="isReduced"
    :isPrivate="isPrivate"
  />
</template>

<script setup lang="ts">
import type { Group } from "~/types/group";

defineProps<{
  group: Group;
  isPrivate?: boolean;
  isReduced?: boolean;
}>();
</script>
