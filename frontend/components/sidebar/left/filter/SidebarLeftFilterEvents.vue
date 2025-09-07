<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex w-full flex-col space-y-2">
    <div class="flex w-full flex-col items-center">
      <FormSelectorRadio
        v-if="!sidebar.collapsed || !sidebar.collapsedSwitch"
        @update:modelValue="updateViewType"
        :model-value="viewType"
        :options="optionViews"
      />
    </div>
    <Form
      @submit="handleSubmit"
      class="px-1"
      :schema="schema"
      :send-on-change="true"
      :is-there-submit-button="false"
    >
      <FormItem
        v-slot="{ id, handleChange, value }"
        name="days"
        :label="$t('i18n.components.sidebar_left_filter_events.days_ahead')"
      >
        <FormSelectorRadio
          @update:modelValue="handleChange"
          :id="id"
          :model-value="value.value as string"
          :options="optionDays"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, handleChange, value }"
        name="eventType"
        :label="$t('i18n.components.sidebar_left_filter_events.event_type')"
      >
        <FormSelectorRadio
          @update:modelValue="handleChange"
          :id="id"
          :model-value="value.value as string"
          :options="optionEventTypes"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, handleChange, value }"
        name="locationType"
        :label="$t('i18n.components.sidebar_left_filter_events.location_type')"
      >
        <FormSelectorRadio
          @update:modelValue="handleChange"
          :id="id"
          :model-value="value.value as string"
          :options="optionLocations"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
        name="location"
      >
        <FormTextInputSearch
          @blur="handleBlur"
          @update:modelValue="handleChange"
          :id="id"
          :modelValue="value.value as string"
          :hasError="!!errorMessage.value"
          label="Filter by location"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, handleChange }"
        :label="$t('i18n.components._global.topics')"
        name="topics"
      >
        <FormSelectorCombobox
          @update:selectedOptions="
            (val: unknown) => handleChange(val as TopicEnum[])
          "
          :id="id"
          :options="optionsTopics"
          :label="$t('i18n.components._global.topics')"
        />
      </FormItem>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";

import type { TopicEnum } from "~/types/content/topics";

import { GLOBAL_TOPICS } from "~/types/content/topics";
import { IconMap } from "~/types/icon-map";
import { ViewType } from "~/types/view-types";

const { t } = useI18n();

const optionsTopics = GLOBAL_TOPICS.map((topic, index) => ({
  label: t(topic.label),
  value: topic.topic,
  id: index,
}));
const schema = z.object({
  days: z.string().optional(),
});
const sidebar = useSidebar();

const optionViews = [
  {
    value: ViewType.LIST,
    key: "list",
    content: IconMap.LIST_UNORDERED,
    aria_label: "i18n.components.sidebar_left_filter_events.view_type_list",
    isIcon: true,
  },
  {
    value: ViewType.MAP,
    key: "map",
    content: IconMap.PIN_MAP_FILL,
    aria_label: "i18n.components.sidebar_left_filter_events.view_type_map",
    isIcon: true,
  },
  {
    value: ViewType.CALENDAR,
    key: "calendar",
    content: IconMap.CALENDAR_DATE_FILL,
    aria_label: "i18n.components.sidebar_left_filter_events.view_type_calendar",
    isIcon: true,
  },
];

const optionDays = [
  {
    value: "1",
    key: "1",
    content: "1",
    aria_label: "i18n.components.sidebar_left_filter_events.days_1_aria_label",
  },
  {
    value: "7",
    key: "7",
    content: "7",
    aria_label: "i18n.components.sidebar_left_filter_events.days_7_aria_label",
  },
  {
    value: "30",
    key: "30",
    content: "30",
    aria_label: "i18n.components.sidebar_left_filter_events.days_30_aria_label",
  },
];

const optionEventTypes = [
  {
    value: "LEARN",
    key: "LEARN",
    content: t("i18n.components._global.learn"),
    aria_label:
      "i18n.components.sidebar_left_filter_events.event_type_learn_aria_label",
    checkedClass: "style-learn",
  },
  {
    value: "ACTION",
    key: "ACTION",
    content: t("i18n.components._global.action"),
    aria_label:
      "i18n.components.sidebar_left_filter_events.event_type_action_aria_label",
    checkedClass: "style-action",
  },
];

const optionLocations = [
  {
    value: "IN_PERSON",
    key: "IN_PERSON",
    content: t(
      "i18n.components.sidebar_left_filter_events.location_type_in_person"
    ),
    aria_label:
      "i18n.components.sidebar_left_filter_events.location_type_in_person_aria_label",
    class: "text-nowrap text-left pl-4",
  },
  {
    value: "ONLINE",
    key: "ONLINE",
    content: t(
      "i18n.components.sidebar_left_filter_events.location_type_online"
    ),
    aria_label:
      "i18n.components.sidebar_left_filter_events.location_type_online_aria_label",
  },
];

const route = useRoute();
const router = useRouter();
const updateViewType = (
  value: string | number | boolean | Record<string, unknown> | undefined
) => {
  if (
    typeof value === "string" &&
    Object.values(ViewType).includes(value as ViewType)
  ) {
    viewType.value = value as ViewType;
    router.push({
      query: {
        ...route.query,
        view: value,
      },
    });
    return;
  }
};

const viewType = ref(ViewType.MAP);
const q = route.query.view;
if (typeof q === "string" && Object.values(ViewType).includes(q as ViewType)) {
  viewType.value = q as ViewType;
}
const handleSubmit = (_values: unknown) => {
  // Handle form submission.
};
</script>
