<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalAlert
    @confirm="handleDelete"
    :message="t('i18n.components.modal.faq_entry.delete._global.message')"
    :modalName="modalName"
  />
</template>

<script setup lang="ts">
const { t } = useI18n();

const props = defineProps<{
  faqEntryId: string;
  entityId: string;
}>();

const orgId = computed(() => props.entityId);

const modalName = "ModalFaqEntryDeleteOrganization";
const { handleCloseModal } = useModalHandlers(modalName);

const { deleteFAQ } = useOrganizationFAQEntryMutations(orgId, {
  delete: {
    onSuccess: () => handleCloseModal(),
  },
});

const handleDelete = async () => {
  deleteFAQ(props.faqEntryId);
};
</script>
