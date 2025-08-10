<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <FormFAQEntry
      :formData="formData"
      :handleSubmit="handleSubmit"
      submitLabel="i18n.components.modal.edit._global.update_texts"
    />
  </ModalBase>
</template>

<script setup lang="ts">
import type { FaqEntry } from "~/types/content/faq-entry";

const props = defineProps<{
  faqEntry: FaqEntry;
}>();

const modalName = "ModalEditFaqEntryOrganization" + props.faqEntry.id;
const { handleCloseModal } = useModalHandlers(modalName);

const paramsOrgId = useRoute().params.orgId;
const orgId = typeof paramsOrgId === "string" ? paramsOrgId : undefined;
const organizationStore = useOrganizationStore();
await organizationStore.fetchById(orgId);

const { organization } = organizationStore;

const formData = ref<FaqEntry>({
  id: props.faqEntry.id,
  iso: props.faqEntry.iso,
  order: props.faqEntry.order,
  question: "",
  answer: "",
});

onMounted(async () => {
  formData.value.id = props.faqEntry.id;
  formData.value.question = props.faqEntry.question;
  formData.value.answer = props.faqEntry.answer;
});

watch(
  props,
  (newValues) => {
    formData.value.id = newValues.faqEntry.id;
    formData.value.question = newValues.faqEntry.question;
    formData.value.answer = newValues.faqEntry.answer;
  },
  {
    deep: true,
  }
);

async function handleSubmit(values: unknown) {
  let updateResponse = false;
  const newValues = { ...formData.value, ...(values as FaqEntry) };

  updateResponse = await organizationStore.updateFaqEntry(
    organization,
    newValues as FaqEntry
  );

  if (updateResponse) {
    handleCloseModal();
  }
}
</script>
