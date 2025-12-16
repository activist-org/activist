<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36">
    <Form
      id="event-location-and-time"
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
      :schema="scheduleSchema"
    >
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
      <FormItem
        v-slot="{ handleChange, value, errorMessage, formValues }"
        label="Event Schedule"
        name="times"
      >
          <FormDateTime
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
          label="Create another event"
        />
      </FormItem>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";

const flow = inject<FlowControls>("flow");
const scheduleSchema = z.object({
  dates: z.object({
    start: z.date(),
    end: z.date(),
  }),
  location: z.string().min(1, "Location is required"),
  link: z.string().url("Please enter a valid URL").optional(),
  createAnother: z.boolean().optional(),
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
