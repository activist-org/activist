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

const modalName = "ModalResourceDeleteOrganization";
const { handleCloseModal } = useModalHandlers(modalName);

const organizationId = computed(() => props.entityId);
const { deleteResource } = useOrganizationResourcesMutations(organizationId);
const handleDelete = async () => {
  await deleteResource(props.resourceId);
  handleCloseModal();
};
</script>
