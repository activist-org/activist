<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <MediaMap
    class="h-[17.5rem] w-full"
    :pointers="pointers"
    :type="MapType.CLUSTER"
    :clusterProperties="clusterProperties"
    :clusterTooltipCreate="buildExpandedTooltipCluster"
  />
</template>
<script setup lang="ts">
import type { GeoJsonProperties } from "geojson";

import type { Event, EventType } from "~/types/events/event";

import {
  MapType,
  type ClusterProperties,
  type PointerCluster,
  type PopupContent,
} from "~/types/map";
import { colorByType } from "~/utils/mapUtils";
const organizationIcon = `/icons/map/tooltip_organization.png`;
const calendarIcon = `/icons/map/tooltip_datetime.png`;
const locationIcon = `/icons/map/tooltip_location.png`;
const props = defineProps<{
  events: Event[];
}>();
const { events } = props;
const i18n = useI18n();
const buildExpandedTooltipPointer = (event: Event) => {
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
  const organization = "Organization"; // Replace with actual organization name
  const datetime = "Date and Time"; // Replace with actual date and time

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
const buildExpandedTooltipCluster = (pointer: unknown) => {
  const opts = pointer as { learn: number; action: number };
  const root = document.createElement("div");
  root.className = "w-[220px] cursor-pointer font-sans";

  let tooltipClass = "overflow-hidden bg-white rounded-sm border-l-8 border-l";

  if (opts.learn === 0) {
    tooltipClass += "-[#BA3D3B]";
  } else if (opts.action === 0) {
    tooltipClass += "-[#2176AE]";
  }

  const eventsInThisArea = i18n.t(
    "i18n.components.media_map_events.events_in_this_areaa"
  );
  let clusterTooltipHTML = `
      <div class="${tooltipClass}">
        <div class="px-3 pt-1">
          <h3 class="font-display text-base text-black font-bold mb-2 leading-tight">${eventsInThisArea}:</h3>
    `;

  const learnEvents = i18n.t("i18n.components.media_map_events.learn_events");
  if (opts.learn > 0) {
    clusterTooltipHTML += `
        <div class="flex items-center text-xs text-black mb-1.5 font-semibold space-x-2">
          <span>${learnEvents}: ${opts.learn}</span>
        </div>
      `;
  }

  const actionEvents = i18n.t("i18n.components.media_map_events.action_events");
  if (opts.action > 0) {
    clusterTooltipHTML += `
        <div class="flex items-center text-xs text-black mb-1.5 font-semibold space-x-2">
          <span>${actionEvents}: ${opts.action}</span>
        </div>
      `;
  }

  clusterTooltipHTML += `
        </div>
      </div>
    `;

  root.innerHTML = clusterTooltipHTML;

  return root as PopupContent;
};
const pointers: PointerCluster[] = events.map((event) => {
  return {
    id: event.id,
    color: colorByType[event.type as EventType],
    location: event.offlineLocation || {
      displayName: event.name,
      lat: "0",
      lon: "0",
      id: "",
      bbox: ["0", "0", "0", "0"],
    },
    popup: buildExpandedTooltipPointer(event),
    createPopupCluster: buildExpandedTooltipCluster,
    properties: {
      id: event.id,
      name: event.name,
      type: event.type,
      location: event.offlineLocation ? event.offlineLocation.displayName : "",
    },
  };
});
const clusterProperties: ClusterProperties = {
  cluster: {
    learn: {
      logic: ["+", ["case", ["==", ["get", "type"], "learn"], 1, 0]],
      color: colorByType.learn,
    },
    action: {
      color: colorByType.action,
      logic: ["+", ["case", ["==", ["get", "type"], "action"], 1, 0]],
    },
  },
  getPointerColor: (props: GeoJsonProperties) => {
    if (!props) {
      return "";
    }
    // This function is used to get the pointer color when there is only one in the cluster
    return colorByType[props.type as EventType];
  },
  getIndividualDonutProps: (props: GeoJsonProperties) => {
    if (!props) {
      return [];
    }
    // This function is used to get the individual donut props when there is only one in the cluster
    return [
      { value: +(props.type === "learn"), color: colorByType.learn as string },
      {
        value: +(props.type === "action"),
        color: colorByType.action as string,
      },
    ];
  },
  getMultipleDonutProps(props: GeoJsonProperties) {
    if (!props) {
      return [];
    }
    return [
      { value: props.learn, color: colorByType.learn as string },
      { value: props.action, color: colorByType.action as string },
    ];
  },
};
</script>
