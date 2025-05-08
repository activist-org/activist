<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardConnect :socialLinks="organization.socialLinks" />
</template>

<script setup lang="ts">
const paramsOrgId = useRoute().params.orgId;
const orgId = typeof paramsOrgId === "string" ? paramsOrgId : undefined;

const organizationStore = useOrganizationStore();
await organizationStore.fetchById(orgId);
const { organization } = organizationStore;
</script>
