<template>
  <div
    id="map"
    class="card-style-base dark:brightness-95 dark:contrast-[90%] dark:hue-rotate-180 dark:invert"
  ></div>
</template>

<script setup lang="ts">
import type { LayerSpecification, Map } from "maplibre-gl"; // Import Map type
import "maplibre-gl/dist/maplibre-gl.css";

const props = defineProps<{
  pointer?: Pointer;
  type: MapType; 
  pointers?: PointerCluster[]; 
  clusterProperties?: ClusterProperties; 
  clusterTooltipCreate?: (pointer: unknown) => PopupContent; 
  pointerTooltipCreate?: (pointer: Pointer) => PopupContent; 
}>();

const { createMap, isWebglSupported, addDefaultControls } = useMap();

const { createMapForClusterTypeMap } = useClusterMap();
const { createMapForPointerTypeMap } = usePointerMap();

// MARK: Map Tooltip Helper

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
  // ... (Map layer definitions remain the same)
];

// Local reference to the MapLibre instance for cleanup
let mapInstance: Map | null = null; 

// MARK: Map Creation
onMounted(() => {
  if (!isWebglSupported()) {
    alert(t("i18n.components.media_map.maplibre_gl_alert"));
  } else {
    const map = createMap(mapLayers) as Map; 
    mapInstance = map;

    addDefaultControls(map);
    setMapLayers(mapLayers);
    setMap(map);

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
    // This line is the essential fix for the WebGL crash.
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