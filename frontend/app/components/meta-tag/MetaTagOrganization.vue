<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <NuxtLink
    v-if="organization && organization.length > 0"
    :aria-label="
      $t('i18n.components._global.navigate_to_organization_aria_label')
    "
    :to="$localePath(`/organizations/${organization[0]?.id}/about`)"
  >
    <MetaTag
      class="pr-2"
      iconName="IconOrganization"
      :value="organization[0]?.name ?? ''"
    />
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  organization: Organization[];
  iconSize?: string;
}>();
</script>
