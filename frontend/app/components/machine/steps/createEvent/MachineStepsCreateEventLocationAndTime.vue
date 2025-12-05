<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36">
    <Form
      id="event-details"
      @submit="signInUser"
      class="space-y-4"
      :schema="locationAndTimeSchema"
    >
      <FormItem
        v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
        label="Location"
        name="location"
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormTextInput
          :id="id"
          @blur="handleBlur"
          @input="handleChange"
          :hasError="!!errorMessage.value"
          label="Location"
          :modelValue="(value.value as string)"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
        label="Link to event"
        name="link"
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormTextInput
          :id="id"
          @blur="handleBlur"
          @input="handleChange"
          :hasError="!!errorMessage.value"
          label="Link to event"
          :modelValue="(value.value as string)"
        />
      </FormItem>
       <FormItem
        v-slot="{ handleChange, value, errorMessage }"
        label="Event Schedule"
        name="dates"
      >
          <FormDateTimeCalendar
          @update:modelValue="handleChange"
          :hasError="!!errorMessage.value"
          mode="date"
          :model-value="value.value"
          />
      </FormItem>
      <FormItem v-slot="{ id, handleChange, handleBlur }" name="createAnother">
        <FormCheckbox
          :id="id"
          @blur="handleBlur"
          @update:model-value="handleChange"
          data-testid="create-another"
        />
      </FormItem>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";

const flow = inject<FlowControls>("flow");
const locationAndTimeSchema = z.object({
  schedule: z.object({
    start: z.date(),
    end: z.date(),
  }),
  location: z.string().min(1, "Location is required"),
  link: z.string().url("Please enter a valid URL").optional(),
});

const signInUser = async (values: Record<string, unknown>) => {
  // Simulate an API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (!flow) return;
  flow.next(values);
};

</script>
