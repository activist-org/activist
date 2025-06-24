<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col items-center">
    <FormViewSelector
      @update:modelValue="updateViewType"
      :model-value="viewType"
      :options="options"
    />
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";
import { ViewType } from "~/types/view-types";
const options = [
  {
    value: ViewType.LIST,
    key: "list",
    content: IconMap.LIST_UNORDERED,
    aria_label: "i18n.components.sidebar_left_content_events.view_type_list",
    isIcon: true,
  },
  {
    value: ViewType.MAP,
    key: "map",
    content: IconMap.PIN_MAP_FILL,
    aria_label: "i18n.components.sidebar_left_content_events.view_type_map",
    isIcon: true,
  },
  {
    value: ViewType.CALENDAR,
    key: "calendar",
    content: IconMap.CALENDAR_DATE_FILL,
    aria_label:
      "i18n.components.sidebar_left_content_events.view_type_calendar",
    isIcon: true,
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
  console.warn("Invalid view type:", value);
};
const viewType = ref(ViewType.MAP);
const q = route.query.view;
if (typeof q === "string" && Object.values(ViewType).includes(q as ViewType)) {
  viewType.value = q as ViewType;
}
</script>
