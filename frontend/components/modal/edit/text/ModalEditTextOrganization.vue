<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <Form :schema="schema" @submit="onSubmit">
      <div class="flex flex-col space-y-7">
        <FormItem name="description" :label="$t('i18n._global.about')" :required="true">
          <FormTextArea v-model="formData.description" />
        </FormItem>
        <FormItem name="getInvolved" :label="$t('i18n.components._global.get_involved')">
          <FormTextArea v-model="formData.getInvolved" />
        </FormItem>
        <FormItem name="getInvolvedUrl" :label="$t('i18n.components.modal_edit_text_organization.join_organization_link')">
          <FormTextInput v-model="formData.getInvolvedUrl" />
          <p>{{ $t('i18n.components.modal.edit.text._global.remember_https') }}</p>
        </FormItem>
        <BtnAction
          type="submit"
          :cta="true"
          label="i18n.components.modal.edit._global.update_texts"
          fontSize="base"
          ariaLabel="i18n.components.modal.edit._global.update_texts_aria_label"
        />
      </div>
    </Form>
  </ModalBase>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { z } from 'zod';
import Form from '@/components/form/Form.vue';
import FormItem from '@/components/form/FormItem.vue';
import FormTextArea from '@/components/form/text/FormTextArea.vue';
import FormTextInput from '@/components/form/text/FormTextInput.vue';
import type { OrganizationUpdateTextFormData } from "~/types/communities/organization";

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

const schema = z.object({
  description: z.string().min(1, "About is required"),
  getInvolved: z.string().optional(),
  getInvolvedUrl: z.string().optional(),
});

onMounted(() => {
  formData.value.description = organization.texts.description;
  formData.value.getInvolved = organization.texts.getInvolved;
  formData.value.getInvolvedUrl = organization.getInvolvedUrl;
});

function onSubmit(values: OrganizationUpdateTextFormData) {
  handleSubmit(values);
}

async function handleSubmit(values: OrganizationUpdateTextFormData) {
  const response = await organizationStore.updateTexts(
    organization,
    values
  );
  if (response) {
    handleCloseModal();
  }
}
</script>
