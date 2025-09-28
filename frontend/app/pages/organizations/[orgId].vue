<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <NuxtLayout
    :name="
      !/organizations-orgId-groups-groupId.*/.test($route.name as string)
        ? 'organization-page'
        : false
    "
  >
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});
</script>
