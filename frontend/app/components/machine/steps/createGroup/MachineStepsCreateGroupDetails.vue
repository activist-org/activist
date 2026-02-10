<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36">
    <Form
      id="event-details"
      @submit="handleSubmit"
      class="space-y-4"
      :schema="organizationDetailsSchema"
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
        :label="$t('i18n._global.organization')"
        name="organization"
        required
      >
        <!-- prettier-ignore-attribute :selected-organizations -->
        <FormSelectorComboboxOrganizations
          :id="id"
          @update:selectedOption="
            (val: unknown) => handleChange(val as Organization)
          "
          :isMultiSelect="false"
          :label="$t('i18n._global.organization')"
          :linked-user-id="user?.id || ''"
          :selected-organizations="((value.value?[value.value]:[]) as Organization[])"
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
const organizationDetailsSchema = z.object({
  name: z.string().min(1, t("i18n._global.required")),
  tagline: z.string().optional(),
  description: z.string().min(1, t("i18n._global.required")),
  organization: z.string().min(1, t("i18n._global.required")),
});
const handleSubmit = (values: Record<string, unknown>) => {
  // Simulate an API call.
  if (!flow) return;
  flow.next({ ...values, org: values.organization });
};
</script>
