<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <FormFAQEntry
      :formData="formData"
      :handleSubmit="handleSubmit"
      :submitLabel="submitLabel"
      :title="title"
    />
  </ModalBase>
</template>

<script setup lang="ts">
import type { FaqEntry } from "~/types/content/faq-entry";

const props = defineProps<{
  faqEntry?: FaqEntry;
}>();

const isAddMode = !props.faqEntry;
const modalName = "ModalFaqEntryEvent" + props.faqEntry?.id;
const { handleCloseModal } = useModalHandlers(modalName);

const paramsEventId = useRoute().params.eventId;
const eventId = typeof paramsEventId === "string" ? paramsEventId : undefined;

const eventStore = useEventStore();
await eventStore.fetchById(eventId);
const { event } = eventStore;

const formData = ref<FaqEntry>(
  isAddMode
    ? {
        id: "",
        iso: "en",
        order: event.faqEntries.length,
        question: "",
        answer: "",
      }
    : {
        id: props.faqEntry!.id,
        iso: props.faqEntry!.iso,
        order: props.faqEntry!.order,
        question: "",
        answer: "",
      }
);

const submitLabel = isAddMode
  ? "i18n.components.modal.faq_entry._global.add_faq_entry"
  : "i18n.components.modal._global.update_texts";

const title = isAddMode
  ? "i18n.components.modal.faq_entry._global.add_faq_entry"
  : "i18n.components.modal.faq_entry._global.edit_entry";

onMounted(async () => {
  if (!isAddMode && props.faqEntry) {
    formData.value.id = props.faqEntry.id;
    formData.value.question = props.faqEntry.question;
    formData.value.answer = props.faqEntry.answer;
  }
});

watch(
  props,
  (newValues) => {
    if (!isAddMode && newValues.faqEntry) {
      formData.value.id = newValues.faqEntry.id;
      formData.value.question = newValues.faqEntry.question;
      formData.value.answer = newValues.faqEntry.answer;
    }
  },
  {
    deep: true,
  }
);

async function handleSubmit(values: unknown) {
  let updateResponse = false;
  const newValues = { ...formData.value, ...(values as FaqEntry) };

  updateResponse = isAddMode
    ? await eventStore.createFaqEntry(event, newValues as FaqEntry)
    : await eventStore.updateFaqEntry(event, newValues as FaqEntry);

  if (updateResponse) {
    handleCloseModal();
  }
}
</script>
