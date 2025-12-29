<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36">
    <Form
      id="event-type-and-roles"
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
      :schema="topicsSettingsSchema"
      :submit-label="$t('i18n._global.next_step')"
    >
      <FormItem
        v-slot="{ id, handleChange, value }"
        data-testid="events-filter-location-type"
        :label="$t('i18n.components._global.location_type')"
        name="setting"
        required
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormSelectorRadio
          :id="id"
          @update:modelValue="handleChange"
          :modelValue="(value.value as string)"
          :options="optionLocations"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, handleChange, value }"
        data-testid="events-filter-event-type"
        :label="$t('i18n.components._global.event_type')"
        name="type"
        required
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormSelectorRadio
          :id="id"
          @update:modelValue="handleChange"
          :modelValue="(value.value as string)"
          :options="optionEventTypes"
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
          @update:selected-topics="
            (val: unknown) => handleChange(val as TopicEnum[])
          "
          :label="$t('i18n.components._global.topics')"
          :selected-topics="((value.value ?? []) as TopicEnum[])"
        />
      </FormItem>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";

const { t } = useI18n();
const flow = inject<FlowControls>("flow");
const topicsSettingsSchema = z.object({
  setting: z.string().min(1, t("i18n._global.required")),
  topics: z.array(z.string()).optional(),
  type: z.string().min(1, t("i18n._global.required")),
});
const handlePrev = () => {
  if (!flow) return;
  flow.prev();
};
const optionEventTypes = [
  {
    value: "learn",
    key: "LEARN",
    content: t("i18n.components._global.learn"),
    aria_label: "i18n.components._global.event_type_learn_aria_label",
    checkedClass: "style-learn",
  },
  {
    value: "action",
    key: "ACTION",
    content: t("i18n.components._global.action"),
    aria_label: "i18n.components._global.event_type_action_aria_label",
    checkedClass: "style-action",
  },
];
const optionLocations = [
  {
    value: "physical",
    key: "PHYSICAL",
    content: t("i18n.components._global.location_type_physical"),
    aria_label: "i18n.components._global.location_type_physical_aria_label",
    class: "text-nowrap",
  },
  {
    value: "online",
    key: "ONLINE",
    content: t("i18n.components._global.location_type_online"),
    aria_label: "i18n.components._global.location_type_online_aria_label",
    class: "text-nowrap",
  },
];
const handleSubmit = async (values: Record<string, unknown>) => {
  // Simulate an API call.
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (!flow) return;
  flow.next(values);
};
</script>
