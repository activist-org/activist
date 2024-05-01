<template>
  <MetaTag
    iconName="IconOrganization"
    :value="organization.name"
    class="pr-2"
  />
</template>

<script setup lang="ts">
import type { Organization } from "~/types/organization";

defineProps<{
  organization: Organization;
  iconSize?: string;
}>();
</script>
