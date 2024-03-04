<template>
  <ModalOrganizationStatus :status="status" :organization="organization" />
</template>

<script setup lang="ts">
import type { Organization } from "~/types/organization";

defineProps<{
  status: string;
  organization: Organization;
}>();
</script>
