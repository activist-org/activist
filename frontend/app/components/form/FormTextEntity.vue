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
        :label="$t('i18n._global.description')"
        name="description"
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
        :label="$t(getInvolvedLabel)"
        name="getInvolved"
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
        :label="$t(getInvolvedUrlLabel)"
        name="getInvolvedUrl"
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormTextInput
          :id="id"
          @blur="handleBlur"
          @update:modelValue="handleChange"
          :hasError="!!errorMessage.value"
          :label="rememberHttpsLabel ? $t(rememberHttpsLabel) : ''"
          :modelValue="(value.value as string)"
        />
      </FormItem>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { z } from "zod";

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

const schema = z
  .object({
    description: z
      .string()
      .default("")
      .transform((val) => val.trim())
      .pipe(
        z
          .string()
          .min(1, t("i18n.components.form_text_entity.description_required"))
          .max(
            2500,
            t("i18n.components.form_text_entity.max_text_length", {
              max_text_length: 2500,
            })
          )
      ),
    getInvolved: z
      .string()
      .max(
        500,
        t("i18n.components.form_text_entity.max_text_length", {
          max_text_length: 500,
        })
      )
      .optional(),
    getInvolvedUrl: z
      .string()
      .optional()
      .refine(
        (value) => {
          if (!value) return true;
          const trimmed = value.trim();
          // Treat whitespace-only as empty (no URL validation needed).
          if (trimmed.length === 0) return true;
          // Validate trimmed URL.
          return z.string().url().safeParse(trimmed).success;
        },
        {
          message: t("i18n.components.form._global.valid_url_required"),
        }
      ),
  })
  .superRefine(({ getInvolved, getInvolvedUrl }, ctx) => {
    const hasGetInvolvedText = getInvolved && getInvolved.trim().length > 0;
    const hasGetInvolvedUrl =
      getInvolvedUrl && getInvolvedUrl.trim().length > 0;

    if (!hasGetInvolvedText && !hasGetInvolvedUrl) {
      ctx.addIssue({
        code: "custom",
        message: t(
          "i18n.components.form_text_entity.get_involved_text_or_url_required"
        ),
        path: ["getInvolved"],
      });
      ctx.addIssue({
        code: "custom",
        message: t(
          "i18n.components.form_text_entity.get_involved_text_or_url_required"
        ),
        path: ["getInvolvedUrl"],
      });
    }
  });
</script>
