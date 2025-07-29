<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <MediaMap
    class="h-[17.5rem] w-full"
    :pointer="pointer"
    :type="MapType.POINT"
  />
</template>

<script setup lang="ts">
import type { Event, EventType } from "~/types/events/event";

import { MapType, type Pointer } from "~/types/map";
import { colorByType } from "~/utils/mapUtils";
const organizationIcon = `/icons/map/tooltip_organization.png`;
const calendarIcon = `/icons/map/tooltip_datetime.png`;
const locationIcon = `/icons/map/tooltip_location.png`;
const props = defineProps<{
  event: Event;
}>();
const { event } = props;
const buildExpandedTooltip = () => {
  const root = document.createElement("div");
  root.className = "w-[220px] cursor-pointer font-sans";

  let tooltipClass = "";
  if (event.type === "learn") {
    tooltipClass =
      "overflow-hidden bg-white rounded-sm border-l-8 border-l-[#2176AE]";
  } else {
    tooltipClass =
      "overflow-hidden bg-white rounded-sm border-l-8 border-l-[#BA3D3B]";
  }
  const url = "";
  const organization = "Organization"; // replace with actual organization name
  const datetime = "Date and Time"; // replace with actual date and time

  root.innerHTML = `
      <a href="${url}" class="no-underline">
        <div class="${tooltipClass}">
          <div class="px-3 py-1">
            <h3 class="font-display text-base text-black font-bold mb-2 leading-tight">${event.name}</h3>

            <div class="flex items-center text-xs text-black mb-1.5 font-semibold space-x-2">
              <img src="${organizationIcon}"/>
              <span>${organization}</span>
            </div>

            <div class="flex items-center text-xs text-black mb-1.5 font-semibold space-x-2">
              <img src="${calendarIcon}"/>
              <span>${datetime}</span>
            </div>

            <div class="flex items-start text-xs text-black mb-1.5 font-semibold space-x-2">
              <img src="${locationIcon}"/>
              <span>${event.offlineLocation?.displayName.split(",").slice(0, 3).join(", ")}</span>
            </div>
          </div>
        </div>
      </a>
    `;

  return root;
};
const pointer: Pointer = {
  id: event.id,
  color: colorByType[event.type as EventType],
  location: event.offlineLocation || {
    displayName: event.name,
    lat: "0",
    lon: "0",
    id: "",
    bbox: ["0", "0", "0", "0"],
  },
  popup: buildExpandedTooltip(),
};
</script>
