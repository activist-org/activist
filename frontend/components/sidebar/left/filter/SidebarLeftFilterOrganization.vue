<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <Form
    @submit="handleSubmit"
    class="px-1"
    :schema="schema"
    :send-on-change="true"
    :is-there-submit-button="false"
    :initial-values="formData"
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
        :label="
          $t('i18n.components.sidebar.left.filter._global.filter_by_location')
        "
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
import type { LocationQueryRaw } from "vue-router";

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
const organizationStore = useOrganizationStore();
watch(
  route,
  (form) => {
    formData.value = { ...form.query };
    if (form.query.name && form.query.name !== "")
      organizationStore.fetchAll({
        name: form.query.name as string,
        ...formData.value,
      });
  },
  { immediate: true }
);

const handleSubmit = (_values: unknown) => {
  const values: LocationQueryRaw = {};
  const input = (_values || {}) as Record<string, LocationQueryRaw[string]>;
  Object.keys(input).forEach((key) => {
    if (input[key] && input[key] !== "") {
      if (
        key === "topics" &&
        Array.isArray(input[key]) &&
        input[key].length === 0
      ) {
        return;
      }
      values[key] = input[key];
    }
    if (route.query.name && route.query.name !== "")
      values["name"] = route.query.name;
  });
  router.push({
    query: values, // use the normalized values object
  });
  organizationStore.fetchAll(values as OrganizationFilters);
};
</script>
