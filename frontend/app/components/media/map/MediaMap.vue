<template>
  <div
    id="map"
    class="card-style-base dark:brightness-95 dark:contrast-[90%] dark:hue-rotate-180 dark:invert"
  ></div>
</template>

<script setup lang="ts">
import type { LayerSpecification, Map } from "maplibre-gl"; // Import Map type for better clarity

import "maplibre-gl/dist/maplibre-gl.css";

// Assuming these types are defined elsewhere
type Pointer = unknown;
type PointerCluster = unknown;
type MapType = unknown;
enum MapType { POINT, CLUSTER } // Placeholder for MapType enum
type ClusterProperties = unknown;
type PopupContent = unknown;

const props = defineProps<{
  pointer?: Pointer;
  type: MapType;
  pointers?: PointerCluster[];
  clusterProperties?: ClusterProperties;
  clusterTooltipCreate?: (pointer: unknown) => PopupContent;
  pointerTooltipCreate?: (pointer: Pointer) => PopupContent;
}>();

// NOTE: It is CRITICAL that `useMap` provides a way to access the map instance
// or a cleanup function. We'll assume for now `createMap` returns the instance
// and we store it locally for cleanup.
const { createMap, isWebglSupported, addDefaultControls } = useMap();

const { createMapForClusterTypeMap, cleanupClusterMap } = useClusterMap(); // Assuming a cleanup function exists
const { createMapForPointerTypeMap, cleanupPointerMap } = usePointerMap(); // Assuming a cleanup function exists

// MARK: Map Tooltip Helper

// Returns a <div> containing the whole card so we can pass it to popup.setDOMContent().

const { t } = useI18n();
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

// Local reference to the MapLibre instance for cleanup
let mapInstance: Map | null = null; 

// MARK: Map Creation
onMounted(() => {
  if (!isWebglSupported()) {
    alert(t("i18n.components.media_map.maplibre_gl_alert"));
  } else {
    const map = createMap(mapLayers) as Map; // Cast to Map type
    mapInstance = map; // Store map instance

    addDefaultControls(map);
    setMapLayers(mapLayers);
    setMap(map); // Assuming setMap stores the instance for useRouting

    if (props.type === MapType.POINT) {
      if (!props.pointer) {
        return;
      }
      const pointer: Pointer = props.pointer;
      createMapForPointerTypeMap(map, pointer, isTouchDevice);
    }
    if (props.type === MapType.CLUSTER) {
      if (!props.pointers || props.pointers.length === 0) {
        return;
      }
      const { pointers } = props;
      createMapForClusterTypeMap(
        map,
        pointers || [],
        isTouchDevice,
        props.clusterProperties as ClusterProperties,
        props?.clusterTooltipCreate as (pointer: unknown) => PopupContent,
        props?.pointerTooltipCreate as (pointer: unknown) => PopupContent
      );
    }
  }
});

// MARK: Cleanup (CRITICAL FIX FOR CRASHES)
onUnmounted(() => {
  if (mapInstance) {
    // 1. Call cleanup functions in composables (if they exist)
    if (props.type === MapType.POINT) {
      cleanupPointerMap(mapInstance); 
    }
    if (props.type === MapType.CLUSTER) {
      // This function should remove sources/layers added by cluster logic
      cleanupClusterMap(mapInstance); 
    }

    // 2. Remove the MapLibre instance to free up WebGL context and memory
    mapInstance.remove();
    console.log('MapLibre GL instance removed on component unmount.');
    mapInstance = null;
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