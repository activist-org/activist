<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <diV
    :class="{
      'space-y-6 pb-6 pt-3 md:pt-4': type === 'list',
      'grid grid-cols-3 gap-6': type === 'grid',
    }"
  >
    <CardSearchResultEntityOrganization
      v-for="org in props.organizations"
      :key="org.id"
      :isPrivate="false"
      :organization="org"
      :type="cardType"
    />
  </diV>
</template>

<script setup lang="ts">
const props = defineProps<{
  organizations: Organization[];
  type?: "grid" | "list";
}>();
const cardType = computed(() =>
  props.type === "list" ? "detailed" : "compact"
);
</script>
