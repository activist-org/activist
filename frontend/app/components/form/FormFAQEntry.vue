<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <Form
    @submit="handleSubmit"
    :initial-values="formData as undefined"
    :schema="schema"
    :submit-label="$t(submitLabel)"
  >
    <h2 v-if="title">
      {{ $t(title) }}
    </h2>
    <div class="flex flex-col space-y-7">
      <FormItem
        v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
        :label="$t('i18n.components.form_faq_entry.question')"
        name="question"
        :required="true"
      >
        <FormTextArea
          :id="id"
          @blur="handleBlur"
          @input="handleChange"
          :hasError="!!errorMessage.value"
          :value="value.value"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
        :label="$t('i18n.components.form_faq_entry.answer')"
        name="answer"
        :required="true"
      >
        <FormTextArea
          :id="id"
          @blur="handleBlur"
          @input="handleChange"
          :hasError="!!errorMessage.value"
          :value="value.value"
        />
      </FormItem>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { z } from "zod";
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
