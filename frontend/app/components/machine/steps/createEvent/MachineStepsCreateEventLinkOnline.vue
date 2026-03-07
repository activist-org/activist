<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36">
    <Form
      id="event-link-online"
      @submit="handleSubmit"
      :action-buttons="[
        {
          onclick: handlePrev,
          cta: false,
          fontSize: 'base',
          ariaLabel:
            'i18n.components.machine.steps._global.previous_step_aria_label',
          label: 'i18n.components.machine.steps._global.previous_step',
          type: 'button',
        },
      ]"
      class="space-y-4"
      :schema="linkSchema"
      :submit-label="$t('i18n._global.next_step')"
    >
      <FormItem
        v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
        :label="
          $t(
            'i18n.components.machine_steps_create_event_link_online.link_to_event'
          )
        "
        name="onlineLocationLink"
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormTextInput
          :id="id"
          @blur="handleBlur"
          @input="handleChange"
          :hasError="!!errorMessage.value"
          :label="
            $t(
              'i18n.components.machine_steps_create_event_link_online.link_to_event'
            )
          "
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
  onlineLocationLink: z.string().url("Please enter a valid URL").optional(),
});
const handlePrev = () => {
  if (!flow) return;
  flow.prev();
};
const handleSubmit = (values: Record<string, unknown>) => {
  if (!flow) return;
  flow.next(values);
};
</script>
