<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalAlert
    @confirm="handleDelete"
    :message="$t('i18n.components.modal.resource.delete._global.message')"
    :modalName="modalName"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  resourceId: string;
  entityId: string;
}>();

const orgId = computed(() => props.entityId);

const modalName = "ModalResourceDeleteOrganization";
const { handleCloseModal } = useModalHandlers(modalName);

const { deleteResource } = useOrganizationResourcesMutations(orgId, {
  delete: {
    onSuccess: () => handleCloseModal(),
  },
});

const handleDelete = async () => {
  deleteResource(props.resourceId);
};
</script>
