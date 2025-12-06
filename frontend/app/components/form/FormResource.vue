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
        :label="$t('i18n.components.form_resource.name')"
        name="name"
        :required="true"
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormTextInput
          :id="id"
          @blur="handleBlur"
          @update:modelValue="handleChange"
          :hasError="!!errorMessage.value"
          :label="$t('i18n.components.form_resource.name')"
          :modelValue="(value.value as string)"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
        :label="$t('i18n.components.form_resource.description')"
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
        :label="$t('i18n.components.form_resource.link')"
        name="url"
        :required="true"
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormTextInput
          :id="id"
          @blur="handleBlur"
          @update:modelValue="handleChange"
          :hasError="!!errorMessage.value"
          :label="$t('i18n.components.form_resource.link')"
          :modelValue="(value.value as string)"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, handleChange, value }"
        :label="$t('i18n.components._global.topics')"
        name="topics"
      >
        <!-- prettier-ignore-attribute :selected-topics -->
        <FormSelectorComboboxTopics
          :id="id"
          @update:selectedOptions="
            (val: unknown) => handleChange(val as TopicEnum[])
          "
          :hasColOptions="false"
          :label="$t('i18n.components._global.topics')"
          :selected-topics="(value.value as TopicEnum[])"
        />
      </FormItem>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { z } from "zod";

defineProps<{
  formData?: Resource;
  handleSubmit: (values: unknown) => Promise<void>;
  submitLabel: string;
  title?: string;
}>();

const { t } = useI18n();

const schema = z.object({
  name: z.string().min(1, t("i18n.components.form_resource.name_required")),
  description: z
    .string()
    .min(1, t("i18n.components.form_resource.description_required")),
  url: z
    .string()
    .min(1, t("i18n.components.form_resource.link_required"))
    .url(t("i18n.components.form_resource.url_must_be_valid")),
  topics: z
    .array(
      z
        .string()
        .refine((val) => Object.values(TopicEnum).includes(val as TopicEnum), {
          message: t("i18n.components.form_resource.invalid_topic"),
        })
    )
    .optional(),
});
</script>
