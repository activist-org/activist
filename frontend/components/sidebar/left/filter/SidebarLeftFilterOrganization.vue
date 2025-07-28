<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <Form
    @submit="handleSubmit"
    :schema="schema"
    :send-on-change="true"
    :is-there-submit-button="false"
  >
    <FormItem
      v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
      :label="$t('i18n.components.sidebar_left_filter_organization.location')"
      name="location"
    >
      <FormTextInputSearch
        @blur="handleBlur"
        @update:modelValue="handleChange"
        :id="id"
        :modelValue="value.value as string"
        :hasError="!!errorMessage.value"
        label="Filter by location"
      />
    </FormItem>
    <FormItem
      v-slot="{ id, handleChange }"
      :label="$t('i18n.components.sidebar_left_filter_organization.topics')"
      name="topics"
    >
      <FormSelectorCombobox
        @update:selectedOptions="(val: unknown) => handleChange(val as Topic[])"
        :id="id"
        :options="options"
        label="Topics"
      />
    </FormItem>
  </Form>
</template>
<script setup lang="ts">
import { z } from "zod";

import type { Topic } from "~/types/topics";

import { GLOBAL_TOPICS } from "~/types/topics";
const { t } = useI18n();
const options = GLOBAL_TOPICS.map((topic, index) => ({
  label: t(topic.label),
  value: topic.value,
  id: index,
}));
const schema = z.object({
  location: z.string().optional(),
  topics: z.array(z.string()).optional(),
});
const handleSubmit = (values: unknown) => {
  // Handle form submission
  console.log("Form submitted with values:", values);
};
</script>
