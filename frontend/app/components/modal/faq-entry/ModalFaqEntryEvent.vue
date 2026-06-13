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
const modalName = "ModalFaqEntryEvent";
const { handleCloseModal } = useModalHandlers<{ faqEntry?: FaqEntry }>(
  modalName
);

const props = defineProps<{
  faqEntry?: FaqEntry;
  entityId: string;
}>();

const eventId = computed(() => props.entityId);

const { data: event } = useGetEvent(eventId);
const { updateFAQ, createFAQ } = useEventFAQEntryMutations(eventId);

const formData = ref({
  id: "",
  iso: "en",
  order: (event.value?.faqEntries ?? []).length,
  question: "",
  answer: "",
});

let isAddMode = true;
let submitLabel = "";
let title = "";

watch(
  () => props,
  (newProps) => {
    isAddMode = !newProps?.faqEntry;
    submitLabel = isAddMode
      ? "i18n.components.modal.faq_entry._global.add_faq_entry"
      : "i18n.components.modal._global.update_texts";

    title = isAddMode
      ? "i18n.components.modal.faq_entry._global.add_faq_entry"
      : "i18n.components.modal.faq_entry._global.edit_entry";

    if (!isAddMode) {
      formData.value.id = newProps?.faqEntry?.id || "";
      formData.value.question = newProps?.faqEntry?.question || "";
      formData.value.answer = newProps?.faqEntry?.answer || "";
    }
  },
  { immediate: true }
);

async function handleSubmit(values: unknown) {
  let updateResponse = false;
  const newValues = { ...formData.value, ...(values as FaqEntry) };

  updateResponse = isAddMode
    ? await createFAQ(newValues as FaqEntry)
    : await updateFAQ(newValues as FaqEntry);

  if (updateResponse) {
    handleCloseModal();
  }
}
</script>
