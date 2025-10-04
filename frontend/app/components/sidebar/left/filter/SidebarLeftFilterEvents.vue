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
      :initial-values="formData"
    >
      <FormItem
        v-slot="{ id, handleChange, value }"
        name="days"
        :label="$t('i18n.components.sidebar_left_filter_events.days_ahead')"
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormSelectorRadio
          @update:modelValue="handleChange"
          :id="id"
          :modelValue="(value.value as string)"
          :options="optionDays"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, handleChange, value }"
        name="type"
        :label="$t('i18n.components.sidebar_left_filter_events.event_type')"
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormSelectorRadio
          @update:modelValue="handleChange"
          :id="id"
          :modelValue="(value.value as string)"
          :options="optionEventTypes"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, handleChange, value }"
        name="setting"
        :label="$t('i18n.components.sidebar_left_filter_events.location_type')"
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormSelectorRadio
          @update:modelValue="handleChange"
          :id="id"
          :modelValue="(value.value as string)"
          :options="optionLocations"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
        :label="$t('i18n._global.location')"
        name="location"
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormTextInputSearch
          @blur="handleBlur"
          @update:modelValue="handleChange"
          :id="id"
          :modelValue="(value.value as string)"
          :hasError="!!errorMessage.value"
          :label="
            $t('i18n.components.sidebar.left.filter._global.filter_by_location')
          "
          :ariaLabel="
            $t(
              'i18n.components.sidebar.left.filter._global.search_button_aria_label'
            )
          "
        />
      </FormItem>
      <FormItem
        v-slot="{ id, handleChange, value }"
        :label="$t('i18n.components._global.topics')"
        name="topics"
      >
        <!-- prettier-ignore-attribute :selected-options -->
        <FormSelectorCombobox
          @update:selectedOptions="
            (val: unknown) => handleChange(val as TopicEnum[])
          "
          :id="id"
          :selected-options="((value.value ?? []) as TopicEnum[])"
          :options="optionsTopics"
          :label="$t('i18n.components._global.topics')"
        />
      </FormItem>
    </Form>
  </div>
</template>

<script setup lang="ts">
import type { TopicEnum } from "#shared/types/content/topics";
import type { LocationQueryRaw } from "vue-router";

import { GLOBAL_TOPICS } from "#shared/types/content/topics";
import { IconMap } from "#shared/types/icon-map";
import { ViewType } from "#shared/types/view-types";
import { z } from "zod";
const { t } = useI18n();

const optionsTopics = GLOBAL_TOPICS.map((topic, index) => ({
  label: t(topic.label),
  value: topic.topic,
  id: index,
}));
const schema = z.object({
  days: z.string().optional(),
  location: z.string().optional(),
  topics: z.array(z.string()).optional(),
  type: z.string().optional(),
  setting: z.string().optional(),
  viewType: z.string().optional(),
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
const formData = ref({});
watch(
  route,
  (form) => {
    formData.value = { ...form.query };
  },
  { immediate: true }
);
const handleSubmit = (_values: unknown) => {
  const values: Record<string, unknown> = {};
  const input = (_values || {}) as Record<string, unknown>;
  Object.keys(input).forEach((key) => {
    if (input[key] && input[key] !== "") {
      if (key === "days") {
        values["active_on"] = new Date(
          new Date().setDate(new Date().getDate() + +(input[key] as string))
        ).toISOString();
        return;
      }
      if (
        key === "topics" &&
        Array.isArray(input[key]) &&
        input[key].length === 0
      ) {
        return;
      }
      if (key === "viewType") return;
      values[key] = input[key];
    }
    if (route.query.name && route.query.name !== "")
      values["name"] = route.query.name;
  });
  router.push({
    query: {
      ...(values as LocationQueryRaw),
    },
  });
};
</script>
