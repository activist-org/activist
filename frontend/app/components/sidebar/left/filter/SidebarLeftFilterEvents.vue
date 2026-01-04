<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex w-full flex-col space-y-2" data-testid="events-filter">
    <div
      class="flex w-full flex-col items-center"
      data-testid="events-filter-view-type"
    >
      <FormSelectorRadio
        v-if="!sidebar.collapsed || !sidebar.collapsedSwitch"
        @update:modelValue="updateViewType"
        :model-value="viewType"
        :options="optionViews"
      />
    </div>
       
    <Form
      :key="formKey"
      @submit="handleSubmit"
      class="px-1"
      :initial-values="formData"
      :is-there-submit-button="false"
      :schema="schema"
      :send-on-change="true"
    >
      <FormItem
        v-slot="{ id, handleChange, value }"
        data-testid="events-filter-days"
        :label="$t('i18n.components.sidebar_left_filter_events.days_ahead')"
        name="days"
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormSelectorRadio
          :id="id"
          @update:modelValue="handleChange"
          :modelValue="(value.value as string)"
          :options="optionDays"
          :toggleable="true"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, handleChange, value }"
        data-testid="events-filter-event-type"
        :label="$t('i18n.components._global.event_type')"
        name="type"
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormSelectorRadio
          :id="id"
          @update:modelValue="handleChange"
          :modelValue="(value.value as string)"
          :options="optionEventTypes"
          :toggleable="true"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, handleChange, value }"
        data-testid="events-filter-location-type"
        :label="$t('i18n.components._global.location_type')"
        name="setting"
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormSelectorRadio
          :id="id"
          @update:modelValue="handleChange"
          :modelValue="(value.value as string)"
          :options="optionLocations"
          :toggleable="true"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, handleChange, handleBlur, errorMessage, value }"
        data-testid="events-filter-location"
        :label="$t('i18n._global.location')"
        name="location"
      >
        <!-- prettier-ignore-attribute :modelValue -->
        <FormTextInputSearch
          :id="id"
          @blur="handleBlur"
          @update:modelValue="handleChange"
          :ariaLabel="
            $t(
              'i18n.components.sidebar.left.filter._global.search_button_aria_label'
            )
          "
          :hasError="!!errorMessage.value"
          :label="
            $t('i18n.components.sidebar.left.filter._global.filter_by_location')
          "
          :modelValue="(value.value as string)"
        />
      </FormItem>
      <FormItem
        v-slot="{ id, handleChange, value }"
        data-testid="events-filter-topics"
        :label="$t('i18n.components._global.topics')"
        name="topics"
      >
        <!-- prettier-ignore-attribute :selected-options -->
        <FormSelectorCombobox
          :id="id"
          @update:selectedOptions="
            (val: unknown) => handleChange(val as TopicEnum[])
          "
          :label="$t('i18n.components._global.topics')"
          :options="optionsTopics"
          :selected-options="((value.value ?? []) as TopicEnum[])"
        />
      </FormItem>
    </Form>
  </div>
</template>

<script setup lang="ts">
import type { LocationQueryRaw } from "vue-router";

import { z } from "zod";

const { t, te } = useI18n();


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

const route = useRoute();
const router = useRouter();
const formKey = ref(0);
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
const formData = ref({});
watch(
  route,
  (form) => {
    const { view, ...rest } = (form.query as Record<string, unknown>) || {};
    const topics = normalizeArrayFromURLQuery(form.query.topics);
    formData.value = { ...rest, topics };
    viewType.value =
      typeof view === "string" &&
      Object.values(ViewType).includes(view as ViewType)
        ? (view as ViewType)
        : ViewType.MAP;
  },
  { immediate: true }
);
const handleSubmit = (_values: unknown) => {
  const values: Record<string, unknown> = {};
  const input = (_values || {}) as Record<string, unknown>;
  

  Object.keys(input).forEach((key) => {
    if (input[key] && input[key] !== "") {
      if (key === "days") {
        values["days_ahead"] = input[key];
        return;
      }
      if (key === "topics" && Array.isArray(input[key]) && input[key].length === 0) {
        return;
      }
      if (key === "view") return;
      values[key] = input[key];
    }
  });
  if (route.query.name && route.query.name !== "") values["name"] = route.query.name;

  router.push({
    query: {
      ...(values as LocationQueryRaw),
      view: viewType.value,
    },
  });
};


</script>
