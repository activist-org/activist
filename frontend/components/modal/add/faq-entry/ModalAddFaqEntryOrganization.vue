<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <FormFAQEntry
      :formData="formData"
      :handleSubmit="handleSubmit"
      submitLabel="i18n.components.modal.add.faq_entry._global.add_faq_entry"
    />
  </ModalBase>
</template>

<script setup lang="ts">
import type { FaqEntry } from "~/types/content/faq-entry";

const modalName = "ModalAddFaqEntryOrganization";
const { handleCloseModal } = useModalHandlers(modalName);

const paramsOrgId = useRoute().params.orgId;
const orgId = typeof paramsOrgId === "string" ? paramsOrgId : undefined;
const organizationStore = useOrganizationStore();
await organizationStore.fetchById(orgId);

const { organization } = organizationStore;

const formData = ref<FaqEntry>({
  id: "",
  iso: "en",
  order: organization.faqEntries.length,
  question: "",
  answer: "",
});

async function handleSubmit(values: unknown) {
  let updateResponse = false;
  const newValues = { ...formData.value, ...(values as FaqEntry) };

  updateResponse = await organizationStore.createFaqEntry(
    organization,
    newValues as FaqEntry
  );

  if (updateResponse) {
    handleCloseModal();
  }
}
</script>
