<template>
  <div
    id="map"
    class="dark:contrast-90 card-style-base dark:brightness-95 dark:hue-rotate-180 dark:invert"
  ></div>
</template>

<script setup lang="ts">
import type { LayerSpecification, Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const props = defineProps<{
  pointer?: Pointer;
  type: MapType;
  pointers?: PointerCluster[];
  clusterProperties?: ClusterProperties;
  clusterTooltipCreate?: (pointer: unknown) => PopupContent;
  pointerTooltipCreate?: (pointer: Pointer) => PopupContent;
}>();

// Composables
const { createMap, isWebglSupported, addDefaultControls } = useMap();
const { createMapForClusterTypeMap } = useClusterMap();
const { createMapForPointerTypeMap } = usePointerMap();

const { t } = useI18n();
const colorMode = useColorMode();
const { setMapLayers, setMap } = useRouting();

const isTouchDevice =
  // @ts-ignore
  navigator.msMaxTouchPoints > 0 ||
  "ontouchstart" in window ||
  navigator.maxTouchPoints > 0;


// MAP LAYERS (EXACTLY AS REQUIRED)

const mapLayers: LayerSpecification[] = [
  {
    id: "background",
    type: "background",
    paint: {
      "background-color":
        colorMode.preference === "dark" ? "#131316" : "#F6F8FA",
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

let mapInstance: Map | null = null;
  


// MARK: Map Creation
onMounted(() => {
  if (!isWebglSupported()) {
    alert(t("i18n.components.media_map.maplibre_gl_alert"));
    return;
  }

  const map = createMap(mapLayers) as Map;
  mapInstance = map;

  addDefaultControls(map);
  setMapLayers(mapLayers);
  setMap(map);

  // Instant cluster→marker transition improvement
  map.on("move", () => {
    map.triggerRepaint();
  });

  // POINT MAP
  if (props.type === MapType.POINT) {
    if (!props.pointer) return;

    createMapForPointerTypeMap(
      map,
      props.pointer,
      isTouchDevice,

    );
  }

  // CLUSTER MAP
  if (props.type === MapType.CLUSTER) {
    if (!props.pointers || props.pointers.length === 0) return;

    createMapForClusterTypeMap(
      map,
      props.pointers,
      isTouchDevice,
      props.clusterProperties as ClusterProperties,

      // FIX: force a default tooltip factory so TS is satisfied
      props.clusterTooltipCreate ??
        ((p) => document.createElement("div")),

      props?.pointerTooltipCreate as (pointer: unknown) => PopupContent

    );
  }
});


// CLEANUP — FIXES GL CONTEXT CRASHES
onUnmounted(() => {
  if (mapInstance) {
    mapInstance.remove();
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
