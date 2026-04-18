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
const props = defineProps<{
  faqEntry?: FaqEntry;
}>();

const isAddMode = !props.faqEntry;
const modalName = "ModalFaqEntryGroup" + (props.faqEntry?.id ?? "");
const { handleCloseModal } = useModalHandlers(modalName);

const paramsGroupId = useRoute().params.groupId;
const groupId = typeof paramsGroupId === "string" ? paramsGroupId : "";

const { data: group } = useGetGroup(groupId);
const { updateFAQ, createFAQ } = useGroupFAQEntryMutations(groupId);

const formData = ref({
  id: "",
  iso: "en",
  order: (group.value?.faqEntries ?? []).length,
  question: "",
  answer: "",
});

const submitLabel = isAddMode
  ? "i18n.components.modal.faq_entry._global.add_faq_entry"
  : "i18n.components.modal._global.update_texts";

const title = isAddMode
  ? "i18n.components.modal.faq_entry._global.add_faq_entry"
  : "i18n.components.modal.faq_entry._global.edit_entry";

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

/**
 * Handles the submission of the group FAQ entry form. This function takes the form values as input, processes them to determine whether to create a new FAQ entry or update an existing one based on the isAddMode flag, and then performs the necessary operation using the corresponding mutation. After the operation is completed successfully, the modal is closed to provide feedback to the user that their action has been processed.
 * @param values The values from the group FAQ entry form, which include the question, answer, and order of the FAQ entry. These values are used to either create a new FAQ entry or update an existing one on the server when the form is submitted. The function processes these values and interacts with the createFAQ or updateFAQ mutation based on whether the form is in add mode or edit mode to perform the appropriate operation.
 */
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
