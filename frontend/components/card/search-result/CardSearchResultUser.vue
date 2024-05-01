<template>
  <CardSearchResult
    :user="user"
    :isReduced="isReduced"
    :isPrivate="isPrivate"
  />
</template>

<script setup lang="ts">
import type { User } from "~/types/user";

defineProps<{
  user: User;
  isPrivate?: boolean;
  isReduced?: boolean;
}>();
</script>
