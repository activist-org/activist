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

const modalName = "ModalAddFaqEntryGroup";
const { handleCloseModal } = useModalHandlers(modalName);

const paramsGroupId = useRoute().params.groupId;
const groupId = typeof paramsGroupId === "string" ? paramsGroupId : undefined;
const groupStore = useGroupStore();
await groupStore.fetchById(groupId);

const { group } = groupStore;

const formData = ref<FaqEntry>({
  id: "",
  iso: "en",
  order: group.faqEntries.length,
  question: "",
  answer: "",
});

async function handleSubmit(values: unknown) {
  let updateResponse = false;
  const newValues = { ...formData.value, ...(values as FaqEntry) };

  updateResponse = await groupStore.createFaqEntry(
    group,
    newValues as FaqEntry
  );

  if (updateResponse) {
    handleCloseModal();
  }
}
</script>
