<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
// TODO: REFACTOR: This component is too big, split it up into smaller
components
<template>
  <div
    class="elem-shadow-sm mx-1 rounded-md bg-layer-2 pb-1 pt-2 text-primary-text transition-all duration-500"
  >
    <div class="flex flex-col items-center">
      <FormViewSelector :model-value="viewType" :options="options" />
    </div>
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
    aria_label: "i18n.components.sidebar_left_content_events.view_type_card",
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
const viewType = ref(ViewType.MAP);
</script>
