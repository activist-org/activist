<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    id="map"
    class="card-style-base dark:brightness-95 dark:contrast-[90%] dark:hue-rotate-180 dark:invert"
  ></div>
</template>

<script setup lang="ts">
import type { LayerSpecification } from "maplibre-gl";

import { useMap } from "@/composables/useMap";
import "maplibre-gl/dist/maplibre-gl.css";

import { useClusterMap } from "~/composables/useClusterMap";
import { useRouting } from "~/composables/useRoutingMap";
import {
  MapType,
  type ClusterProperties,
  type Pointer,
  type PointerCluster,
  type PopupContent,
} from "~/types/map";

const props = defineProps<{
  pointer?: Pointer;
  type: MapType;
  pointers?: PointerCluster[];
  clusterProperties?: ClusterProperties;
  clusterTooltipCreate?: (pointer: unknown) => PopupContent;
}>();

const { createMap, isWebglSupported, addDefaultControls } = useMap();

const { createMapForClusterTypeMap } = useClusterMap();
const { createMapForPointerTypeMap } = usePointerMap();

// MARK: Map Tooltip Helper

// Returns a <div> containing the whole card so we can pass it to popup.setDOMContent().

const i18n = useI18n();
const colorMode = useColorMode();
const { setMapLayers, setMap } = useRouting();

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
    const map = createMap(mapLayers);
    addDefaultControls(map);
    setMapLayers(mapLayers);
    setMap(map);

    if (props.type === MapType.POINT) {
      if (!props.pointer) {
        console.error("Pointer is required for MapType.POINT");
        return;
      }
      const pointer: Pointer = props.pointer;
      createMapForPointerTypeMap(map, pointer, isTouchDevice);
    }
    if (props.type === MapType.CLUSTER) {
      if (!props.pointers || props.pointers.length === 0) {
        console.error("Pointers are required for MapType.CLUSTER");
        return;
      }
      const { pointers } = props;
      createMapForClusterTypeMap(
        map,
        pointers || [],
        isTouchDevice,
        props.clusterProperties as ClusterProperties,
        props?.clusterTooltipCreate as (pointer: unknown) => PopupContent
      );
    }
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
