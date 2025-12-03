<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="px-4 sm:px-6 md:px-8 xl:px-24 2xl:px-36">
    <Form
      id="event-details"
      @submit="signInUser"
      class="space-y-4"
      :schema="signInSchema"
    >
      <FormItem
        v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
        label="Name"
        name="name"
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormTextInput
          :id="id"
          @blur="handleBlur"
          @input="handleChange"
          :hasError="!!errorMessage.value"
          label="Name"
          :modelValue="(value.value as string)"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, handleChange, value }"
        data-testid="events-filter-event-type"
        :label="$t('i18n.components.sidebar_left_filter_events.event_type')"
        name="type"
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
        name="description"
        :required="true"
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

const { t } = useI18n();
const flow = inject<any>('flow');
const signInSchema = z.object({
  name: z.string().min(1, t("i18n.pages.auth._global.required")),
  topics: z.array(z.string()).optional(),
  type: z.string().min(1, t("i18n.pages.auth._global.required")),
  createAnother: z.boolean().optional(),
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
const signInUser = async (values: Record<string, unknown>) => {
    // Simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    flow.next(values);
};
</script>
