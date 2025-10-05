<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <FormTextEntity
      :formData="formData"
      :handleSubmit="handleSubmit"
      submitLabel="i18n.components.modal._global.update_texts"
      title="i18n.components.modal_text_organization.edit_organization_texts"
      getInvolvedLabel="i18n.components._global.get_involved"
      getInvolvedUrlLabel="i18n.components.modal_text_organization.join_organization_link"
      rememberHttpsLabel="i18n.components.modal.text._global.remember_https"
    />
  </ModalBase>
</template>

<script setup lang="ts">
import type { OrganizationUpdateTextFormData } from "~/types/communities/organization";

const modalName = "ModalTextOrganization";
const { handleCloseModal } = useModalHandlers(modalName);

const paramsOrgId = useRoute().params.orgId;
const orgId = typeof paramsOrgId === "string" ? paramsOrgId : undefined;

const organizationStore = useOrganizationStore();
await organizationStore.fetchById(orgId);
const { organization } = organizationStore;

const formData = ref<OrganizationUpdateTextFormData>({
  description: "",
  getInvolved: "",
  getInvolvedUrl: "",
});

onMounted(() => {
  formData.value.description = organization.texts.description || "";
  formData.value.getInvolved = organization.texts.getInvolved || "";
  formData.value.getInvolvedUrl = organization.getInvolvedUrl || "";
});

watch(
  organization,
  (newValues) => {
    formData.value.description = newValues.texts.description || "";
    formData.value.getInvolved = newValues.texts.getInvolved || "";
    formData.value.getInvolvedUrl = newValues.getInvolvedUrl || "";
  },
  {
    deep: true,
  }
);

async function handleSubmit(values: unknown) {
  const response = await organizationStore.updateTexts(
    organization,
    values as OrganizationUpdateTextFormData
  );
  if (response) {
    handleCloseModal();
  }
}
</script>
