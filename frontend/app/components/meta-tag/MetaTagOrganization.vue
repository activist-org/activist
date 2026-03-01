<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <NuxtLink
    v-for="org in organization"
    :key="org.id"
    :aria-label="
      $t('i18n.components._global.navigate_to_organization_aria_label')
    "
    :to="$localePath(`/organizations/${org.id}/about`)"
  >
    <MetaTag
      class="pr-2"
      iconName="IconOrganization"
      :value="org.name ?? ''"
    />
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  organization: Organization[];
  iconSize?: string;
}>();
</script>
