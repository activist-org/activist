<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <Form
    @submit="handleSubmit"
    :schema="schema"
    :initial-values="formData as undefined"
    :submit-label="$t(submitLabel)"
  >
    <h2>
      {{ $t("i18n.components.form_faq_entry.edit_entry") }}
    </h2>
    <div class="flex flex-col space-y-7">
      <FormItem
        v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
        name="question"
        :label="$t('i18n.components.form_faq_entry.question')"
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
        name="answer"
        :label="$t('i18n.components.form_faq_entry.answer')"
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
    </div>
  </Form>
</template>

<script setup lang="ts">
import { z } from "zod";

import type { FaqEntry } from "~/types/content/faq-entry";

defineProps<{
  formData?: FaqEntry;
  handleSubmit: (values: unknown) => Promise<void>;
  submitLabel: string;
  title?: string;
}>();

const { t } = useI18n();

const schema = z.object({
  question: z
    .string()
    .min(1, t("i18n.components.form_faq_entry.question_required")),
  answer: z
    .string()
    .min(1, t("i18n.components.form_faq_entry.answer_required")),
});
</script>
