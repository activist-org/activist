<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardSearchResult
    :group="group"
    :isReduced="isReduced"
    :isPrivate="isPrivate"
  />
</template>

<script setup lang="ts">
import type { Group } from "~/types/communities/group";

defineProps<{
  group: Group;
  isPrivate?: boolean;
  isReduced?: boolean;
}>();
</script>
