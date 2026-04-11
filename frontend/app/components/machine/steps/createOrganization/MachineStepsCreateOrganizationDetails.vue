<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36">
    <Form
      id="organization-details"
      @submit="handleSubmit"
      class="space-y-4"
      :initial-values="initialDetailsData"
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
    </Form>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";

const { t } = useI18n();
const flow = inject<FlowControls>("flow");

const organizationDetailsSchema = z.object({
  name: z.string().min(1, t("i18n._global.required")),
  tagline: z.string().optional(),
  description: z.string().min(1, t("i18n._global.required")),
});

const initialDetailsData = computed(() => {
  const ctx = flow?.context?.value;
  if (
    !ctx?.nodeData ||
    ctx.nodeId !== CreateOrganizationSteps.OrganizationDetails
  )
    return {};
  return ((ctx.nodeData as Record<string, unknown>)[ctx.nodeId] ??
    {}) as Record<string, unknown>;
});

const handleSubmit = async (values: Record<string, unknown>) => {
  if (!flow) return;
  flow.next(values);
};
</script>
