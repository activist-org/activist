<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36">
    <Form
      id="event-link-online"
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
      :schema="linkSchema"
    >
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
    </Form>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";

const flow = inject<FlowControls>("flow");
const linkSchema = z.object({
  link: z.string().url("Please enter a valid URL").optional(),
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
