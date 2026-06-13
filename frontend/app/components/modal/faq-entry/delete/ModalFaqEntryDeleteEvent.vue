<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalAlert
    @confirm="handleDelete"
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
const { deleteFAQ } = useEventFAQEntryMutations(eventId);
const handleDelete = async () => {
  await deleteFAQ(props.faqEntryId);
  handleCloseModal();
};
</script>
