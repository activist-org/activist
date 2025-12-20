<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36">
    <Form
      id="event-details"
      v-slot="{ values }"
      @submit="handleSubmit"
      class="space-y-4"
      :schema="eventDetailsSchema"
      :submit-label="$t('i18n._global.next_step')"
    >
      <FormItem
        v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
        :label="$t('i18n._global.name')"
        name="name"
        required
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormTextInput
          :id="id"
          @blur="handleBlur"
          @input="handleChange"
          :hasError="!!errorMessage.value"
          :label="$t('i18n._global.name')"
          :modelValue="(value.value as string)"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
        :label="$t('i18n._global.tagline')"
        name="tagline"
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormTextInput
          :id="id"
          @blur="handleBlur"
          @input="handleChange"
          :hasError="!!errorMessage.value"
          :label="$t('i18n._global.tagline')"
          :modelValue="(value.value as string)"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
        :label="$t('i18n._global.description')"
        name="description"
        required
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
        v-slot="{ id, handleChange, value }"
        :label="$t('i18n._global.organizations')"
        name="organizations"
        required
      >
        <!-- prettier-ignore-attribute :selected-organizations -->
        <FormSelectorComboboxOrganizations
          :id="id"
          @update:selectedOptions="
            (val: unknown) => handleChange(val as Organization[])
          "
          :label="$t('i18n._global.organizations')"
          :linked-user-id="user?.id || ''"
          :selected-organizations="((value.value ?? []) as Organization[])"
        />
      </FormItem>
      <FormItem
        v-if="values.organizations && values.organizations.length"
        v-slot="{ id, handleChange, value }"
        :label="$t('i18n._global.groups')"
        name="groups"
      >
        <!-- prettier-ignore-attribute :selected-groups -->
        <FormSelectorComboboxGroups
          :id="id"
          @update:selectedOptions="
            (val: unknown) => handleChange(val as Group[])
          "
          :label="$t('i18n._global.groups')"
          :linked-organizations="values?.organizations as string[]"
          :selected-groups="((value.value ?? []) as Group[])"
        />
      </FormItem>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";

const { t } = useI18n();
const { user } = useUser();
const flow = inject<FlowControls>("flow");

const eventDetailsSchema = z.object({
  name: z.string().min(1, t("i18n._global.required")),
  tagline: z.string().optional(),
  description: z.string().min(1, t("i18n._global.required")),
  organizations: z
    .array(z.string())
    .min(1, "Please select at least one organization"),
  groups: z.array(z.string()).optional(),
});
const handleSubmit = async (values: Record<string, unknown>) => {
  // Simulate an API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (!flow) return;
  flow.next(values);
};
</script>
