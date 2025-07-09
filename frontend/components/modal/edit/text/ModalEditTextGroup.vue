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
        <FormItem name="getInvolvedUrl" :label="$t('i18n.components.modal_edit_text_group.join_group_link')">
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
import type { GroupUpdateTextFormData } from "~/types/communities/group";

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

const schema = z.object({
  description: z.string().min(1, "About is required"),
  getInvolved: z.string().optional(),
  getInvolvedUrl: z.string().optional(),
});

onMounted(() => {
  formData.value.description = group.texts.description;
  formData.value.getInvolved = group.texts.getInvolved;
  formData.value.getInvolvedUrl = group.getInvolvedUrl;
});

function onSubmit(values: GroupUpdateTextFormData) {
  handleSubmit(values);
}

async function handleSubmit(values: GroupUpdateTextFormData) {
  const response = await groupStore.updateTexts(group, values);
  if (response) {
    handleCloseModal();
  }
}
</script>
