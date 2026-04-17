<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <Form
    @submit="handleSubmit"
    class="px-1"
    :initial-values="formData"
    :is-there-submit-button="false"
    :schema="schema"
    :send-on-change="true"
  >
    <FormItem
      v-slot="{ id, handleChange, errorMessage, value }"
      :label="$t('i18n.components._global.country')"
      name="country"
    >
      <!-- prettier-ignore-attribute :modelValue -->
      <FormSelectorComboboxCountry
        :id="id"
        @update:selected-country="handleChange"
        :hasError="!!errorMessage.value"
        :label="$t('i18n.components._global.country')"
        :selected-country="(value.value as string) || ''"
      />
    </FormItem>
    <FormItem
      v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
      :label="$t('i18n.components._global.city')"
      name="city"
    >
      <!-- prettier-ignore-attribute :modelValue -->
      <FormTextInputSearch
        :id="id"
        @blur="handleBlur"
        @update:modelValue="handleChange"
        :ariaLabel="
          $t(
            'i18n.components.sidebar.left.filter._global.search_button_aria_label'
          )
        "
        :hasError="!!errorMessage.value"
        :label="
          $t('i18n.components.sidebar_left_filter_organization.filter_by_city')
        "
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
        :label="$t('i18n.components._global.topics')"
        :selected-topics="((value.value ?? []) as TopicEnum[])"
      />
    </FormItem>
  </Form>
</template>

<script setup lang="ts">
import type { LocationQueryRaw } from "vue-router";

import { z } from "zod";

const schema = z.object({
  city: z.string().optional(),
  topics: z.array(z.string()).optional(),
  country: z.string().optional().nullable(),
});
const route = useRoute();
const router = useRouter();
const formData = ref({});
watch(
  route,
  (r) => {
    const q = { ...(r.query as Record<string, unknown>) };

    // Explicitly set all schema fields to undefined by default.
    // If they are missing from the URL, this forces VeeValidate to clear them
    // instead of resetting them to their initial page-load values.
    const newFormData = {
      city: undefined,
      country: undefined,
      topics: [],
      ...q,
    };

    // Normalize topics into an array for the Combobox.
    if (newFormData.topics && !Array.isArray(newFormData.topics)) {
      newFormData.topics = [newFormData.topics];
    }

    formData.value = newFormData;
  },
  { immediate: true }
);
const handleSubmit = (_values: unknown) => {
  if (!currentRoutePathIncludes("organizations", route.name?.toString() ?? ""))
    return;
  const values: LocationQueryRaw = {};
  const input = (_values || {}) as Record<string, LocationQueryRaw[string]>;
  Object.keys(input).forEach((key) => {
    if (!input[key] && input[key] === "") return (values[key] = undefined);
    if (
      key === "topics" &&
      Array.isArray(input[key]) &&
      input[key].length === 0 &&
      (!route.query.topics ||
        route.query.topics === "" ||
        (Array.isArray(route.query.topics) && route.query.topics.length === 0))
    ) {
      return;
    }
    values[key] = input[key];
    if (route.query.name && route.query.name !== "")
      values["name"] = route.query.name;
  });
  router.push({
    query: values, // use the normalized values object
  });
};
</script>
