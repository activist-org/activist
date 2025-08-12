<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <FormFAQEntry
      :formData="formData"
      :handleSubmit="handleSubmit"
      :submitLabel="submitLabel"
    />
  </ModalBase>
</template>

<script setup lang="ts">
import type { FaqEntry } from "~/types/content/faq-entry";

const props = defineProps<{
  faqEntry?: FaqEntry;
}>();

const isAddMode = !props.faqEntry;
const modalName = isAddMode
  ? "ModalAddFaqEntryGroup"
  : "ModalEditFaqEntryGroup" + props.faqEntry!.id;
const { handleCloseModal } = useModalHandlers(modalName);

const paramsGroupId = useRoute().params.groupId;
const groupId = typeof paramsGroupId === "string" ? paramsGroupId : undefined;
const groupStore = useGroupStore();
await groupStore.fetchById(groupId);

const { group } = groupStore;

const formData = ref({
  id: "",
  iso: "en",
  order: group.faqEntries.length,
  question: "",
  answer: "",
});

const submitLabel = isAddMode
  ? "i18n.components.modal.add.faq_entry._global.add_faq_entry"
  : "i18n.components.modal.edit._global.update_texts";

if (!isAddMode) {
  onMounted(async () => {
    if (props.faqEntry) {
      formData.value.id = props.faqEntry.id;
      formData.value.question = props.faqEntry.question;
      formData.value.answer = props.faqEntry.answer;
    }
  });

  watch(
    props,
    (newValues) => {
      if (newValues.faqEntry) {
        formData.value.id = newValues.faqEntry.id;
        formData.value.question = newValues.faqEntry.question;
        formData.value.answer = newValues.faqEntry.answer;
      }
    },
    {
      deep: true,
    }
  );
}

async function handleSubmit(values: unknown) {
  let updateResponse = false;
  const newValues = { ...formData.value, ...(values as FaqEntry) };

  updateResponse = isAddMode
    ? await groupStore.createFaqEntry(group, newValues as FaqEntry)
    : await groupStore.updateFaqEntry(group, newValues as FaqEntry);

  if (updateResponse) {
    handleCloseModal();
  }
}
</script>
