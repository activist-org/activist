<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    @click="resetDirectionsControl()"
    id="map"
    class="card-style-base dark:brightness-95 dark:contrast-[90%] dark:hue-rotate-180 dark:invert"
  ></div>
</template>

<script setup lang="ts">
import { useMap } from "@/composables/useMap";
import { useRouting } from "~/composables/useRoutingMap";
import MapLibreGlDirections from "@maplibre/maplibre-gl-directions";
import maplibregl, { type LayerSpecification, type Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import type { Location } from "~/types/content/location";
import type { Event, EventType } from "~/types/events/event";
import { MapType } from "~/types/map";

const props = defineProps<{
  eventNames?: string[];
  eventTypes?: EventType[];
  eventLocations?: Location[];
  events?: Event[];
  type: MapType;
}>();

const {
  createMap,
  isWebglSupported,
  createFullScreenControl,
  createMapForMarkerTypeMap,
  createMapForClusterTypeMap,
} = useMap();

// MARK: Map Tooltip Helper

//  Returns a <div> containing the whole card so we can pass it to popup.setDOMContent().

const i18n = useI18n();
const colorMode = useColorMode();
let map: Map;
let marker: maplibregl.Marker;
let directions: MapLibreGlDirections;
const { setSelectedRoute, resetDirectionsControl } = useRouting(
  map,
  directions,
  marker
);

const attendLabelKey = "i18n.components._global.attend";
const attendLabel = i18n.t(attendLabelKey) as string;

const isTouchDevice =
  // Note: `maxTouchPoints` isn't recognized by TS. Safe to ignore.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  navigator.msMaxTouchPoints > 0 ||
  "ontouchstart" in window ||
  navigator.maxTouchPoints > 0;

// MARK: Map Layers

const mapLayers: LayerSpecification[] = [
  {
    id: "background",
    type: "background",
    paint: {
      "background-color":
        colorMode.preference == "dark" ? "#131316" : "#F6F8FA",
    },
  },
  {
    id: "default-layer",
    type: "raster",
    source: "raster-tiles",
    minzoom: 0,
  },
  {
    id: "cycle-layer",
    type: "raster",
    source: "cycle-raster-tiles",
    minzoom: 0,
    layout: {
      visibility: "none",
    },
  },
];

// MARK: Map Creation

onMounted(() => {
  if (!isWebglSupported()) {
    alert(i18n.t("i18n.components.media_map.maplibre_gl_alert"));
  } else {
    map = createMap(mapLayers);

    // MARK: Basic Controls

    // Localize FullscreenControl
    const fullscreenControl = createFullScreenControl();
    map.addControl(fullscreenControl);

    const fullscreenButton: HTMLElement | null = map
      .getContainer()
      .querySelector(".maplibregl-ctrl-fullscreen");
    if (fullscreenButton)
      fullscreenButton.title = i18n.t("i18n.components.media_map.fullscreen");
    if (props.type === MapType.MARK) {
      createMapForMarkerTypeMap(
        map,
        {
          name: props.eventNames ? props.eventNames[0] : "",
          type: props.eventTypes ? props.eventTypes[0] : "learn",
          location: props.eventLocations
            ? props.eventLocations[0]
            :  {} as Location,
        },
        attendLabel,
        isTouchDevice,
        setSelectedRoute(),
        marker,
        resetDirectionsControl
      );
    }
    if (props.type === MapType.CLUSTER)
      createMapForClusterTypeMap(map, props.events || [], isTouchDevice);
  }
});
</script>

<style>
.maplibregl-ctrl-group {
  background-color: rgba(255, 255, 255, 0.75);
}

.maplibregl-popup-content {
  padding: 0 !important;
}

.maplibregl-popup-close-button {
  position: absolute;
  top: 0px;
  right: 0px;
  font-size: 16px;
  width: 20px;
  height: 20px;
  line-height: 20px;
}
</style>
