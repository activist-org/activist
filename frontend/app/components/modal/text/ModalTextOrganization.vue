<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <FormTextEntity
      v-if="texts"
      :formData="formData"
      getInvolvedLabel="i18n.components._global.get_involved"
      getInvolvedUrlLabel="i18n.components.modal_text_organization.join_organization_link"
      :handleSubmit="handleSubmit"
      rememberHttpsLabel="i18n.components.modal.text._global.remember_https"
      submitLabel="i18n.components.modal._global.update_texts"
      title="i18n.components.modal_text_organization.edit_organization_texts"
    />
  </ModalBase>
</template>

<script setup lang="ts">
const modalName = "ModalTextOrganization";
const { handleCloseModal } = useModalHandlers(modalName);

const props = defineProps<{
  entityId: string;
}>();

const organizationId = computed(() => props.entityId);

const { data: organization } = useGetOrganization(organizationId);
const { updateTexts } = useOrganizationTextsMutations(organizationId);

// The query resolves after the modal mounts, so rendering the form before the
// texts arrive prefills blanks and submits against an undefined text id.
const texts = computed(() => organization.value?.texts?.[0]);

const formData = ref<OrganizationUpdateTextFormData>({
  description: "",
  getInvolved: "",
  getInvolvedUrl: "",
});

watch(
  texts,
  (newValues) => {
    formData.value.description = newValues?.description || "";
    formData.value.getInvolved = newValues?.getInvolved || "";
    formData.value.getInvolvedUrl = newValues?.getInvolvedUrl || "";
  },
  {
    deep: true,
    immediate: true,
  }
);

async function handleSubmit(values: unknown) {
  const textId = texts.value?.id;
  if (!textId) {
    return;
  }

  const response = await updateTexts({
    textId: String(textId),
    data: values as OrganizationUpdateTextFormData,
  });
  if (response) {
    handleCloseModal();
  }
}
</script>
