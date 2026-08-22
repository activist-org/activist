<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalAlert
    @confirm="handleDelete"
    :isLoading="loading"
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

const eventId = computed(() => props.entityId);

const modalName = "ModalResourceDeleteEvent";
const { handleCloseModal } = useModalHandlers(modalName);

const { deleteResource, loading } = useEventResourcesMutations(eventId, {
  delete: {
    onSuccess: () => handleCloseModal(),
  },
});

const handleDelete = async () => {
  deleteResource(props.resourceId);
};
</script>
