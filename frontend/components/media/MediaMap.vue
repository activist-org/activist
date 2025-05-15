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
import { useRouting } from "@/composables/useRouting";
import MapLibreGlDirections, {
  layersFactory,
} from "@maplibre/maplibre-gl-directions";
import maplibregl, { type LayerSpecification, type Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import type { Location } from "~/types/content/location";
import type { Event } from "~/types/events/event";

const props = defineProps<{
  eventNames: string[];
  eventTypes: string[];
  eventLocations: Location[];
  events?: Event[];
  isThereClustering?: boolean;
}>();

const {
  createMap,
  isWebglSupported,
  createMap,
  createMarker,
  createFullScreenControl,
  createNavigationControl,
  createGeoLocateControl
} = useMap();

// MARK: Map Tooltip Helper

//  Returns a <div> containing the whole card so we can pass it to popup.setDOMContent().

const i18n = useI18n();
const colorMode = useColorMode();
let map: Map;
let marker: maplibregl.Marker;
let directions: MapLibreGlDirections;
const { setSelectedRoute, resetDirectionsControl, directionControl } =
  useRouting(map, directions, marker);

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

map.addControl(directionControl, "top-left");
resetRouteProfileControl();

// MARK: Map Creation

onMounted(() => {
  if (!isWebglSupported()) {
    alert(i18n.t("i18n.components.media_map.maplibre_gl_alert"));
  } else {
    map = createMap(mapLayers);

    map.fitBounds(
      [
        [
          parseFloat(props.eventLocations[0].bbox[2]),
          parseFloat(props.eventLocations[0].bbox[0]),
        ],
        [
          parseFloat(props.eventLocations[0].bbox[3]),
          parseFloat(props.eventLocations[0].bbox[1]),
        ],
      ],
      {
        duration: 0,
        padding: 120,
      }
    );

    // MARK: Basic Controls

    // Localize FullscreenControl
    const fullscreenControl = createFullScreenControl();
    map.addControl(fullscreenControl);

    const fullscreenButton: HTMLElement | null = map
      .getContainer()
      .querySelector(".maplibregl-ctrl-fullscreen");
    if (fullscreenButton)
      fullscreenButton.title = i18n.t("i18n.components.media_map.fullscreen");

    const navigationControl = createNavigationControl();

    map.addControl(navigationControl, "top-right");

    // Add localized tooltips for NavigationControl buttons
    const zoomInButton: HTMLElement | null = map
      .getContainer()
      .querySelector(".maplibregl-ctrl-zoom-in");
    if (zoomInButton)
      zoomInButton.title = i18n.t("i18n.components.media_map.zoom_in");

    const zoomOutButton: HTMLElement | null = map
      .getContainer()
      .querySelector(".maplibregl-ctrl-zoom-out");
    if (zoomOutButton)
      zoomOutButton.title = i18n.t("i18n.components.media_map.zoom_out");

    const compassButton: HTMLElement | null = map
      .getContainer()
      .querySelector(".maplibregl-ctrl-compass");
    if (compassButton)
      compassButton.title = i18n.t("i18n.components.media_map.reset_north");

    // Localize GeolocateControl
    const geoLocateControl = createGeoLocateControl();
    map.addControl(geoLocateControl);

    const geolocateButton: HTMLElement | null = map
      .getContainer()
      .querySelector(".maplibregl-ctrl-geolocate");
    if (geolocateButton)
      geolocateButton.title = i18n.t("i18n.components.media_map.geolocate");
    let popup: maplibregl.Popup;
    if (props.isThereClustering!) {
      popup = createPopUp({
          name: props.eventNames[0],
          url: ``, // TODO: Pass in event webpage URL
          organization: "Organization", // TODO: Pass in event's organization name
          datetime: "Date & Time", // TODO: Pass in event's date and time information
          location: props.eventLocations[0].displayName
            .split(",")
            .slice(0, 3)
            .join(", "),
          attendLabel,
          eventType: props.eventTypes[0],
        })
    }

    // Arrow icon for directions.
    map
      .loadImage("/icons/from_library/bootstrap_arrow_right.png")
      .then((image) => {
        if (image) {
          map.addImage("route-direction-arrow", image.data);
        }
      });

    if (props.isThereClustering) {
      props.events.forEach((event) => {
        const eventMarker = new maplibregl.Marker({
          color: `${props.markerColors[0]}`,
        });

        eventMarker
          .setLngLat([
            parseFloat(event.offlineLocation.lon),
            parseFloat(event.offlineLocation.lat),
          ])
          .addTo(map);
      });
    } else {
      marker = createMarker(
        (props.eventTypes ?? props.eventTypes[0] === "learn")
          ? "#2176AE"
          : "#BA3D3B",
        props.eventLocations[0],
        popup
      ).addTo(map);
    }

    map.on("load", () => {
      const layers = layersFactory(
        isTouchDevice ? 1.5 : 1,
        isTouchDevice ? 2 : 1
      );

      // MARK: Directions Layer

      // Add arrow to directions layer.
      layers.push({
        id: "maplibre-gl-directions-route-line-direction-arrow",
        type: "symbol",
        source: "maplibre-gl-directions",
        layout: {
          "symbol-placement": "line-center",
          "icon-image": "route-direction-arrow",
          "icon-size": [
            "interpolate",
            ["exponential", 1.5],
            ["zoom"],
            12,
            0.85,
            18,
            1.4,
          ],
        },
        paint: {
          "icon-opacity": 1,
        },
        filter: ["==", ["get", "route"], "SELECTED"],
      });

      directions = new MapLibreGlDirections(map, {
        ...(selectedRoute = setSelectedRoute()),
        requestOptions: {
          alternatives: "true",
        },
        layers,
      });

      directions.interactive = true;
      marker.getElement().addEventListener("mouseenter", () => {
        directions.interactive = false;
      });

      marker.getElement().addEventListener("mouseleave", () => {
        directions.interactive = true;
      });

      resetDirectionsControl();
    });
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
