<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardConnect :socialLinks="socialLinks" pageType="organization" />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

const paramsOrgId = useRoute().params.orgId;
const orgId = typeof paramsOrgId === "string" ? paramsOrgId : undefined;

const organizationStore = useOrganizationStore();
await organizationStore.fetchById(orgId);
const { organization } = storeToRefs(organizationStore);

// Use computed to ensure social links are reactive to store changes
const socialLinks = computed(() => organization.value.socialLinks);
</script>
