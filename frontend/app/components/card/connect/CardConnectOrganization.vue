<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardConnect pageType="organization" :socialLinks="socialLinks" />
</template>

<script setup lang="ts">
import { useGetOrganization } from "~/composables/queries/useGetOrganization";

const paramsOrgId = useRoute().params.orgId;

const { data: organization } = useGetOrganization(
  typeof paramsOrgId === "string" ? paramsOrgId : ""
);

// Use computed to ensure social links are reactive to store changes.
const socialLinks = computed(() => organization.value?.socialLinks || []);
</script>
