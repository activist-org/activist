<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalAlert
    @confirm="handleDelete"
    :isLoading="loading"
    :message="$t('i18n.components.modal.faq_entry.delete._global.message')"
    :modalName="modalName"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  faqEntryId: string;
  entityId: string;
}>();

const modalName = "ModalFaqEntryDeleteEvent";
const { handleCloseModal } = useModalHandlers(modalName);

const eventId = computed(() => props.entityId);
const { deleteFAQ, loading } = useEventFAQEntryMutations(eventId, {
  delete: {
    onSuccess: () => handleCloseModal(),
  },
});
const handleDelete = async () => {
  deleteFAQ(props.faqEntryId);
};
</script>
