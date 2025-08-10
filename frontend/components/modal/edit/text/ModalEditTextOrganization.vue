<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <Form
      @submit="handleSubmit"
      :schema="schema"
      :initial-values="formData"
      :submit-label="$t('i18n.components.modal.edit._global.update_texts')"
    >
      <h2>
        {{
          $t(
            "i18n.components.modal_edit_text_organization.edit_organization_texts"
          )
        }}
      </h2>
      <FormItem
        v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
        :label="$t('i18n._global.description')"
        name="description"
        :required="true"
      >
        <FormTextArea
          @input="handleChange"
          @blur="handleBlur"
          :id="id"
          :value="value.value"
          :hasError="!!errorMessage.value"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
        :label="$t('i18n.components._global.get_involved')"
        name="getInvolved"
      >
        <FormTextArea
          @input="handleChange"
          @blur="handleBlur"
          :id="id"
          :value="value.value"
          :hasError="!!errorMessage.value"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
        :label="
          $t(
            'i18n.components.modal_edit_text_organization.join_organization_link'
          )
        "
        name="getInvolvedUrl"
      >
        <FormTextInput
          @blur="handleBlur"
          @update:modelValue="handleChange"
          :id="id"
          :modelValue="value.value as string"
          :hasError="!!errorMessage.value"
          :label="$t('i18n.components.modal.edit.text._global.remember_https')"
        />
      </FormItem>
    </Form>
  </ModalBase>
</template>

<script setup lang="ts">
import { z } from "zod";

import type { OrganizationUpdateTextFormData } from "~/types/communities/organization";

const { t } = useI18n();

const schema = z.object({
  description: z
    .string()
    .min(1, t("i18n.components.modal.edit.text._global.description_required")),
  getInvolved: z.string().optional(),
  getInvolvedUrl: z.string().optional(),
});

const modalName = "ModalEditTextOrganization";
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
