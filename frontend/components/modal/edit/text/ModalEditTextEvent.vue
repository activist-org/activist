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
        {{ $t("i18n.components.modal_edit_text_event.edit_event_texts") }}
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
        :label="$t('i18n.components._global.participate')"
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
        :label="$t('i18n.components.modal_edit_text_event.offer_to_help_link')"
        name="getInvolvedUrl"
      >
        <FormTextInput
          @blur="handleBlur"
          @update:modelValue="handleChange"
          :id="id"
          :modelValue="value.value as string"
          :hasError="!!errorMessage.value"
          :label="
            $t('i18n.components.modal_edit_text_event.offer_to_help_link_label')
          "
        />
      </FormItem>
    </Form>
  </ModalBase>
</template>

<script setup lang="ts">
import { z } from "zod";

import type { EventUpdateTextFormData } from "~/types/events/event";

const { t } = useI18n();

const schema = z.object({
  description: z
    .string()
    .min(1, t("i18n.components.modal.edit.text._global.description_required")),
  getInvolved: z.string().optional(),
  getInvolvedUrl: z.string().optional(),
});

const modalName = "ModalEditTextEvent";
const { handleCloseModal } = useModalHandlers(modalName);

const paramsEventId = useRoute().params.eventId;
const eventId = typeof paramsEventId === "string" ? paramsEventId : undefined;
const eventStore = useEventStore();
await eventStore.fetchById(eventId);

const { event } = eventStore;

const formData = ref<EventUpdateTextFormData>({
  description: "",
  getInvolved: "",
  getInvolvedUrl: "",
});

onMounted(() => {
  formData.value.description = event.texts.description || "";
  formData.value.getInvolved = event.texts.getInvolved || "";
  formData.value.getInvolvedUrl = event.getInvolvedUrl || "dsda";
});

async function handleSubmit(values: unknown) {
  const response = await eventStore.updateTexts(
    event,
    values as EventUpdateTextFormData
  );
  if (response) {
    handleCloseModal();
  }
}
</script>
