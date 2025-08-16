<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <Form
    @submit="handleSubmit"
    :schema="schema"
    :initial-values="formData as undefined"
    :submit-label="$t(submitLabel)"
  >
    <h2 v-if="title">
      {{ $t(title) }}
    </h2>
    <div class="flex flex-col space-y-7">
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
        :label="$t(getInvolvedLabel)"
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
        :label="$t(getInvolvedUrlLabel)"
        name="getInvolvedUrl"
      >
        <FormTextInput
          @blur="handleBlur"
          @update:modelValue="handleChange"
          :id="id"
          :modelValue="value.value as string"
          :hasError="!!errorMessage.value"
          :label="rememberHttpsLabel ? $t(rememberHttpsLabel) : ''"
        />
      </FormItem>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { z } from "zod";

import type { GroupUpdateTextFormData } from "~/types/communities/group";
import type { OrganizationUpdateTextFormData } from "~/types/communities/organization";
import type { EventUpdateTextFormData } from "~/types/events/event";

type TextEntityFormData =
  | OrganizationUpdateTextFormData
  | GroupUpdateTextFormData
  | EventUpdateTextFormData;

defineProps<{
  formData?: TextEntityFormData;
  handleSubmit: (values: unknown) => Promise<void>;
  submitLabel: string;
  title?: string;
  getInvolvedLabel: string;
  getInvolvedUrlLabel: string;
  rememberHttpsLabel?: string;
}>();

const { t } = useI18n();

const schema = z.object({
  description: z
    .string()
    .min(1, t("i18n.components.form_text_entity.description_required")),
  getInvolved: z.string().optional(),
  getInvolvedUrl: z.string().optional(),
});
</script>
