<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <FormTextEntity
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

const paramsOrgId = useRoute().params.orgId;
const orgId = typeof paramsOrgId === "string" ? paramsOrgId : undefined;

const { data: organization } = useGetOrganization(orgId || "");
const { updateTexts } = useOrganizationTextsMutations(orgId || "");

const formData = ref<OrganizationUpdateTextFormData>({
  description: "",
  getInvolved: "",
  getInvolvedUrl: "",
});

onMounted(() => {
  formData.value.description = organization.value?.texts[0]?.description || "";
  formData.value.getInvolved = organization.value?.texts[0]?.getInvolved || "";
  formData.value.getInvolvedUrl =
    organization.value?.texts[0]?.getInvolvedUrl || "";
});

watch(
  organization,
  (newValues) => {
    formData.value.description = newValues?.texts[0]?.description || "";
    formData.value.getInvolved = newValues?.texts[0]?.getInvolved || "";
    formData.value.getInvolvedUrl = newValues?.texts[0]?.getInvolvedUrl || "";
  },
  {
    deep: true,
  }
);

async function handleSubmit(values: unknown) {
  const response = await updateTexts(
    values as OrganizationUpdateTextFormData,
    String(organization.value?.texts[0]?.id)
  );
  if (response) {
    handleCloseModal();
  }
}
</script>
