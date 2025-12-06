<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36">
    <Form
      id="event-details"
      @submit="handleSubmit"
      class="space-y-4"
      :schema="groupDetailsSchema"
      submit-label="Next"
    >
      <FormItem
        v-slot="{ id, handleChange, value }"
        data-testid="events-filter-location-type"
        :label="$t('i18n.components.sidebar_left_filter_events.location_type')"
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
        :label="$t('i18n.components.sidebar_left_filter_events.event_type')"
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
        v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
        :label="$t('i18n._global.description')"
        name="roles"
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
        label="Topics"
        name="topics"
      >
        <!-- prettier-ignore-attribute :selected-topics -->
        <FormSelectorComboboxTopics
          :id="id"
          @update:selected-topics="
            (val: unknown) => handleChange(val as TopicEnum[])
          "
          label="Topics"
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
const groupDetailsSchema = z.object({
  setting: z.string().min(1, t("i18n.pages.auth._global.required")),
  topics: z.array(z.string()).optional(),
  type: z.string().min(1, t("i18n.pages.auth._global.required")),
  roles: z.string().min(1, t("i18n.pages.auth._global.required")),
});
const optionEventTypes = [
  {
    value: "learn",
    key: "LEARN",
    content: t("i18n.components._global.learn"),
    aria_label:
      "i18n.components.sidebar_left_filter_events.event_type_learn_aria_label",
    checkedClass: "style-learn",
  },
  {
    value: "action",
    key: "ACTION",
    content: t("i18n.components._global.action"),
    aria_label:
      "i18n.components.sidebar_left_filter_events.event_type_action_aria_label",
    checkedClass: "style-action",
  },
];
const optionLocations = [
  {
    value: "offline",
    key: "OFFLINE",
    content: t(
      "i18n.components.sidebar_left_filter_events.location_type_in_person"
    ),
    aria_label:
      "i18n.components.sidebar_left_filter_events.location_type_in_person_aria_label",
    class: "text-nowrap",
  },
  {
    value: "online",
    key: "ONLINE",
    content: t(
      "i18n.components.sidebar_left_filter_events.location_type_online"
    ),
    aria_label:
      "i18n.components.sidebar_left_filter_events.location_type_online_aria_label",
    class: "text-nowrap",
  },
];
const handleSubmit = async (values: Record<string, unknown>) => {
  // Simulate an API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (!flow) return;
  flow.next(values);
};
</script>
