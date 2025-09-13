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
        @update:selectedOptions="
          (val: unknown) => handleChange(val as TopicEnum[])
        "
        :id="id"
        :label="$t('i18n.components._global.topics')"
        :selected-topics="(value.value ?? []) as TopicEnum[]"
      />
    </FormItem>
  </Form>
  </template>
  <script setup lang="ts">
import type { LocationQueryRaw } from 'vue-router';

import { z } from "zod";

import type { OrganizationFilters } from "~/types/communities/organization";
import type { TopicEnum } from "~/types/content/topics";

const schema = z.object({
  location: z.string().optional(),
  topics: z.array(z.string()).optional(),
});
const route = useRoute();
const router = useRouter();
const formData = ref({});
watch(
  route.query,
  (form) => {
    formData.value = { ...form };
  },
  { immediate: true }
);
const organizationStore = useOrganizationStore();

const handleSubmit = (_values: unknown) => {
  const values: LocationQueryRaw = {};
  const input = _values as Record<string, LocationQueryRaw[string]>;
  if (
    input &&
    Object.keys(input).some((key) => input[key] && input[key] !== "")
  ) {
    Object.keys(input).forEach((key) => {
      if (input[key] && input[key] !== "") {
        values[key] = input[key];
      }
    });
    router.push({
      query: values, // Use the normalized values object
    });
    organizationStore.fetchAll(values as OrganizationFilters);
  }
};
</script>
