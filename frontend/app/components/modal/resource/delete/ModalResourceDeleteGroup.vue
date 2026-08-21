<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalAlert
    @confirm="handleDelete"
    :message="t('i18n.components.modal.resource.delete._global.message')"
    :modalName="modalName"
  />
</template>

<script setup lang="ts">
const { t } = useI18n();

const props = defineProps<{
  resourceId: string;
  entityId: string;
}>();

const groupId = computed(() => props.entityId);

const modalName = "ModalResourceDeleteGroup";
const { handleCloseModal } = useModalHandlers(modalName);

const { deleteResource } = useGroupResourcesMutations(groupId, {
  delete: {
    onSuccess: () => handleCloseModal(),
  },
});

const handleDelete = async () => {
  deleteResource(props.resourceId);
};
</script>
