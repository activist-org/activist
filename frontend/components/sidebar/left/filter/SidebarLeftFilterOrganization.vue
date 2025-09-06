<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <Form
    @submit="handleSubmit"
    class="px-1"
    :schema="schema"
    :send-on-change="true"
    :is-there-submit-button="false"
  >
    <FormItem
      v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
      :label="$t('i18n._global.location')"
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
      v-slot="{ id, handleChange, value }"
      :label="$t('i18n.components._global.topics')"
      name="topics"
    >
      <FormSelectorComboboxTopics
        @update:selectedOptions="(val: unknown) => handleChange(val as Topic[])"
        :id="id"
        :label="$t('i18n.components._global.topics')"
        :selected-topics="value.value as Topic[]"
      />
    </FormItem>
  </Form>
</template>
<script setup lang="ts">
import { z } from "zod";

import type { Topic } from "~/types/content/topics";

const schema = z.object({
  location: z.string().optional(),
  topics: z.array(z.string()).optional(),
});

const handleSubmit = (_values: unknown) => {
  // Handle form submission.
};
</script>
