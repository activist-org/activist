<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <NuxtLink
    :aria-label="
      $t('i18n.components._global.navigate_to_organization_aria_label')
    "
    :to="`/organizations/${organization.id}`"
  >
    <MetaTag
      class="pr-2"
      iconName="IconOrganization"
      :value="organization.name"
    />
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  organization: Organization;
  iconSize?: string;
}>();
</script>
