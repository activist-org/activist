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

const modalName = "ModalAddFaqEntryEvent";
const { handleCloseModal } = useModalHandlers(modalName);

const paramsEventId = useRoute().params.eventId;
const eventId = typeof paramsEventId === "string" ? paramsEventId : undefined;
const eventStore = useEventStore();
await eventStore.fetchById(eventId);

const { event } = eventStore;

const formData = ref<FaqEntry>({
  id: "",
  iso: "en",
  order: event.faqEntries.length,
  question: "",
  answer: "",
});

async function handleSubmit(values: unknown) {
  let updateResponse = false;
  const newValues = { ...formData.value, ...(values as FaqEntry) };

  updateResponse = await eventStore.createFaqEntry(
    event,
    newValues as FaqEntry
  );
  if (updateResponse) {
    handleCloseModal();
  }
}
</script>
