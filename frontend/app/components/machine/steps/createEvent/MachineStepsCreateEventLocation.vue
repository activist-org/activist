<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36">
    <Form
      id="event-location"
      @submit="handleSubmit"
      :action-buttons='[{
        onclick:handlePrev,
        cta:false,
        fontSize:"base",
        ariaLabel:"i18n.components.previous_step_aria_label",
        label:"Previous",
        type:"button"
      }]'
      class="space-y-4"
      :schema="locationSchema"
      submit-label="Next"
    >
      <FormItem
        v-slot="{ id, handleChange, errorMessage, value }"
        label="Country"
        name="country"
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormSelectorComboboxCountry
          :id="id"
          @update:selected-country="handleChange"
          :hasError="!!errorMessage.value"
          label="Country"
          :selected-country="(value.value as string) || ''"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
        label="City"
        name="city"
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormTextInput
          :id="id"
          @blur="handleBlur"
          @input="handleChange"
          :hasError="!!errorMessage.value"
          label="City"
          :modelValue="(value.value as string)"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
        label="Address"
        name="address"
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormTextInput
          :id="id"
          @blur="handleBlur"
          @input="handleChange"
          :hasError="!!errorMessage.value"
          label="Address"
          :modelValue="(value.value as string)"
        />
      </FormItem>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";

const flow = inject<FlowControls>("flow");
const locationSchema = z.object({
  country: z.string().min(1, "Country is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required")
});
const handlePrev = () => {
  if (!flow) return;
  flow.prev();
};
const handleSubmit = async (values: Record<string, unknown>) => {
  // Simulate an API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (!flow) return;
  flow.next(values);
};

</script>
