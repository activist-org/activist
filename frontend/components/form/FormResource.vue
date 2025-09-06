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
        name="name"
        :label="$t('i18n.components.form_resource.name')"
        :required="true"
      >
        <FormTextInput
          @blur="handleBlur"
          @update:modelValue="handleChange"
          :id="id"
          :hasError="!!errorMessage.value"
          :modelValue="value.value as string"
          :label="$t('i18n.components.form_resource.name')"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
        name="description"
        :label="$t('i18n.components.form_resource.description')"
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
        name="url"
        :label="$t('i18n.components.form_resource.link')"
        :required="true"
      >
        <FormTextInput
          @blur="handleBlur"
          @update:modelValue="handleChange"
          :id="id"
          :hasError="!!errorMessage.value"
          :modelValue="value.value as string"
          :label="$t('i18n.components.form_resource.link')"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, handleChange, value }"
        :label="$t('i18n.components._global.topics')"
        name="topics"
      >
        <FormSelectorComboboxTopics
          @update:selectedOptions="
            (val: unknown) => handleChange(val as TopicEnum[])
          "
          :id="id"
          :selected-topics="value.value as TopicEnum[]"
          :label="$t('i18n.components._global.topics')"
        />
      </FormItem>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { z } from "zod";

import type { Resource } from "~/types/content/resource";
import type { TopicEnum } from "~/types/content/topics";

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
  topics: z.array(z.string()).optional(),
});
</script>
