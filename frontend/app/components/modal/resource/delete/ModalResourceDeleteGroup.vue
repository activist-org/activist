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

const modalName = "ModalResourceDeleteGroup";
const { handleCloseModal } = useModalHandlers(modalName);

const groupId = computed(() => props.entityId);
const { deleteResource } = useGroupResourcesMutations(groupId);
const handleDelete = async () => {
  await deleteResource(props.resourceId);
  handleCloseModal();
};
</script>
