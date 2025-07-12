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
        {{ $t("i18n.components.modal_edit_text_group.edit_group_texts") }}
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
        :label="$t('i18n.components.modal_edit_text_group.join_group_link')"
        name="getInvolvedUrl"
      >
        <FormTextInput
          @blur="handleBlur"
          @update:modelValue="handleChange"
          :id="id"
          :hasError="!!errorMessage.value"
          :modelValue="value.value as string"
          :label="$t('i18n.components.modal.edit.text._global.remember_https')"
        />
      </FormItem>
    </Form>
  </ModalBase>
</template>

<script setup lang="ts">
import { z } from "zod";

import type { GroupUpdateTextFormData } from "~/types/communities/group";

const { t } = useI18n();

const schema = z.object({
  description: z
    .string()
    .min(1, t("i18n.components.modal.edit.text._global.description_required")),
  getInvolved: z.string().optional(),
  getInvolvedUrl: z.string().optional(),
});

const modalName = "ModalEditTextGroup";
const { handleCloseModal } = useModalHandlers(modalName);

const paramsGroupId = useRoute().params.groupId;
const groupId = typeof paramsGroupId === "string" ? paramsGroupId : undefined;

const groupStore = useGroupStore();
await groupStore.fetchById(groupId);

const { group } = groupStore;

const formData = ref<GroupUpdateTextFormData>({
  description: "",
  getInvolved: "",
  getInvolvedUrl: "",
});

onMounted(() => {
  formData.value.description = group.texts.description || "";
  formData.value.getInvolved = group.texts.getInvolved || "";
  formData.value.getInvolvedUrl = group.getInvolvedUrl || "";
});

async function handleSubmit(values: unknown) {
  const response = await groupStore.updateTexts(
    group,
    values as GroupUpdateTextFormData
  );
  if (response) {
    handleCloseModal();
  }
}
</script>
