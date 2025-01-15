<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <NuxtLink
    :to="`/organizations/${organization.id}`"
    :aria-label="$t('components._global.navigate_to_organization_aria_label')"
  >
    <MetaTag
      iconName="IconOrganization"
      :value="organization.name"
      class="pr-2"
  /></NuxtLink>
</template>

<script setup lang="ts">
import type { Organization } from "~/types/communities/organization";

defineProps<{
  organization: Organization;
  iconSize?: string;
}>();
</script>
