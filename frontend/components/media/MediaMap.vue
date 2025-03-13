<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    @click="resetDirectionsControl()"
    id="map"
    class="card-style-base dark:brightness-95 dark:contrast-[90%] dark:hue-rotate-180 dark:invert"
  ></div>
</template>

<script setup lang="ts">
import MapLibreGlDirections, {
  layersFactory,
} from "@maplibre/maplibre-gl-directions";
import maplibregl, { type Map, type LayerSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Location } from "~/types/content/location";

const props = defineProps<{
  markerColors: string[];
  eventNames: string[];
  eventLocations: Location[];
}>();

const i18n = useI18n();
const colorMode = useColorMode();

const isTouchDevice =
  // Note: `maxTouchPoints` isn't recognized by TS. Safe to ignore.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  navigator.msMaxTouchPoints > 0 ||
  "ontouchstart" in window ||
  navigator.maxTouchPoints > 0;

function isWebglSupported() {
  if (window.WebGLRenderingContext) {
    const canvas = document.createElement("canvas");
    try {
      const context = canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (context && typeof context.getParameter == "function") {
        return true;
      }
    } catch (e) {
      // WebGL is supported, but disabled.
      console.log(e);
    }
    return false;
  }
  // WebGL not supported.
  return false;
}

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

// MARK: Routing

const bikeDirectionsIcon = `/icons/map/bike_directions.png`;
const walkDirectionsIcon = `/icons/map/walk_directions.png`;

interface RouteProfileOption {
  FOOT: string;
  BIKE: string;
  DRIVING: string;
  CAR: string;
}

const routeProfileOptions: RouteProfileOption = {
  FOOT: "foot",
  BIKE: "bike",
  DRIVING: "driving",
  CAR: "car",
};

interface RouteProfile {
  profile: string;
  api: string;
}

const routingAPI = "https://routing.openstreetmap.de/routed-";
const routingAPIVersion = "/route/v1/";

const routeProfileMap: RouteProfile[] = [
  {
    api: `${routingAPI}${routeProfileOptions.FOOT}${routingAPIVersion}`,
    profile: routeProfileOptions.FOOT,
  },
  {
    api: `${routingAPI}${routeProfileOptions.BIKE}${routingAPIVersion}`,
    profile: routeProfileOptions.BIKE,
  },
  {
    api: `${routingAPI}${routeProfileOptions.DRIVING}${routingAPIVersion}`,
    profile: routeProfileOptions.DRIVING,
  },
];

const walkingRouteProfileControl = `
  <div
    title="${i18n.t("i18n.components.media_map.change_profile")}"
    id=${routeProfileOptions.FOOT}
    style="
    background-image: url(${walkDirectionsIcon});
    width: 30px;
    height: 30px;
    background-size: 30px 30px;
    border-radius: 5px;
    box-shadow: 0 0 1px 2px rgba(0, 0, 0, 0.15);
    cursor: pointer"
  >
  `;

const bikeRouteProfileControl = `
  <div
    title="${i18n.t("i18n.components.media_map.change_profile")}"
    id=${routeProfileOptions.BIKE}
    style="
    background-image: url(${bikeDirectionsIcon});
    width: 30px;
    height: 30px;
    background-size: 30px 30px;
    border-radius: 5px;
    box-shadow: 0 0 1px 2px rgba(0, 0, 0, 0.15);
    cursor: pointer"
  >
  `;

let currentProfile = walkingRouteProfileControl;

const mapProfile = (profile: string) => {
  return routeProfileMap.find((item) => item.profile === profile);
};

let selectedRoute = mapProfile(routeProfileOptions.FOOT);

const toggleLayerHandler = (map: Map) => {
  if (currentProfile === walkingRouteProfileControl) {
    map.setLayoutProperty("cycle-layer", "visibility", "visible");
  } else {
    map.setLayoutProperty("cycle-layer", "visibility", "none");
  }
};

const routeProfileHandler = () => {
  if (currentProfile === walkingRouteProfileControl) {
    currentProfile = bikeRouteProfileControl;
  } else {
    currentProfile = walkingRouteProfileControl;
  }
  return currentProfile;
};

const setSelectedRoute = () => {
  if (currentProfile === walkingRouteProfileControl) {
    selectedRoute = mapProfile(routeProfileOptions.FOOT);
  } else {
    selectedRoute = mapProfile(routeProfileOptions.BIKE);
  }
  return selectedRoute;
};

let map: Map;
let marker: maplibregl.Marker;
let directions: MapLibreGlDirections;

// MARK: Profile Switcher

function resetRouteProfileControl() {
  const existingRouteProfileControl = document.getElementById(
    "route-profile-control"
  );
  if (existingRouteProfileControl) {
    existingRouteProfileControl.remove();
  }

  map.addControl(
    {
      onAdd: function () {
        const div = document.createElement("div");
        div.className = "maplibregl-ctrl maplibregl-ctrl-custom-image";
        div.id = "route-profile-control";
        div.innerHTML = currentProfile;

        const updateSelectedProfile = () => {
          toggleLayerHandler(map);

          directions.destroy();
          div.innerHTML = routeProfileHandler();

          directions = new MapLibreGlDirections(map, {
            ...(selectedRoute = setSelectedRoute()),
            requestOptions: {
              alternatives: "true",
            },
            mapLayers,
          });

          directions.interactive = true;
          marker.getElement().addEventListener("mouseenter", () => {
            directions.interactive = false;
          });

          marker.getElement().addEventListener("mouseleave", () => {
            directions.interactive = true;
          });
        };

        div.addEventListener("click", updateSelectedProfile);
        if (window.innerWidth < 768) {
          div.addEventListener("touched", updateSelectedProfile);
        } else {
          document.addEventListener("keydown", (event) => {
            if (event.key === "p") {
              updateSelectedProfile();
            }
          });
        }
        return div;
      },
      onRemove: function () {},
    },
    "top-left"
  );
}

// MARK: Directions Control

function resetDirectionsControl() {
  const existingDirectionControl =
    document.getElementById("directions-control");
  if (existingDirectionControl) {
    existingDirectionControl.remove();
  }

  const directionControl = {
    onAdd: function () {
      const div = document.createElement("div");
      div.className = "maplibregl-ctrl";
      div.id = "directions-control";

      let directionsControlLabel =
        directions.waypoints.length == 0
          ? i18n.t("i18n.components.media_map.click_for_directions")
          : i18n.t("i18n.components.media_map.clear_directions");

      const directionsControlTooltip =
        directions.waypoints.length == 0
          ? i18n.t("i18n.components.media_map.click_for_directions_tooltip")
          : i18n.t("i18n.components.media_map.clear_directions_tooltip");

      // Add hotkey if we're above mobile and there are waypoints.
      if (window.innerWidth >= 768 && directions.waypoints.length != 0) {
        directionsControlLabel = directionsControlLabel += " [x]";
      }

      const clearDirectionsBtn = `
        <div
          title="${directionsControlTooltip}"
          style="
            background-color: rgba(255, 255, 255, 0.75);
            padding: 1px 5px;
            border-radius: 5px;
            box-shadow: 0 0 1px 2px rgba(0, 0, 0, 0.15);
            color: rgba(0, 0, 0, 0.8);
            cursor: pointer
          "
        >
          ${directionsControlLabel}
        </div>
      `;

      div.innerHTML = clearDirectionsBtn;
      div.addEventListener("click", () => directions.clear());
      if (window.innerWidth < 768) {
        div.addEventListener("touchend", () => directions.clear());
      } else {
        document.addEventListener("keydown", (event) => {
          if (event.key === "x") {
            directions.clear();
            resetDirectionsControl();
          }
        });
      }
      return div;
    },
    onRemove: function () {},
  };

  map.addControl(directionControl, "top-left");
  resetRouteProfileControl();
}

// MARK: Map Creation

onMounted(() => {
  if (!isWebglSupported()) {
    alert(i18n.t("i18n.components.media_map.maplibre_gl_alert"));
  } else {
    map = new maplibregl.Map({
      container: "map",
      style: {
        version: 8,
        sources: {
          "raster-tiles": {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution:
              '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap</a>',
          },
          "cycle-raster-tiles": {
            type: "raster",
            tiles: [
              "https://a.tile-cyclosm.openstreetmap.fr/cyclosm-lite/{z}/{x}/{y}.png",
              "https://b.tile-cyclosm.openstreetmap.fr/cyclosm-lite/{z}/{x}/{y}.png",
              "https://c.tile-cyclosm.openstreetmap.fr/cyclosm-lite/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
            attribution:
              '<a href="https://www.cyclosm.org" target="_blank">CyclOSM</a>',
          },
        },
        layers: mapLayers,
      },
      pitch: 20,
      maxZoom: 20,
    });

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
    const fullscreenControl = new maplibregl.FullscreenControl();
    map.addControl(fullscreenControl);

    const fullscreenButton: HTMLElement | null = map
      .getContainer()
      .querySelector(".maplibregl-ctrl-fullscreen");
    if (fullscreenButton)
      fullscreenButton.title = i18n.t("i18n.components.media_map.fullscreen");

    map.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
      }),
      "top-right"
    );

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
    const geolocateControl = new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });
    map.addControl(geolocateControl);

    const geolocateButton: HTMLElement | null = map
      .getContainer()
      .querySelector(".maplibregl-ctrl-geolocate");
    if (geolocateButton)
      geolocateButton.title = i18n.t("i18n.components.media_map.geolocate");

    const popup = new maplibregl.Popup({
      offset: 25,
    }).setHTML(`
      <div style="
        text-align: center;
        color: grey;"
      >
        <div style="font-size: 13px;">${props.eventNames[0]}</div>
        <div style="color: grey;">${props.eventLocations[0].displayName}</div>
      </div>
      `);

    marker = new maplibregl.Marker({
      color: `${props.markerColors[0]}`,
    });

    marker.addClassName("cursor-pointer");
    marker
      .setLngLat([
        parseFloat(props.eventLocations[0].lon),
        parseFloat(props.eventLocations[0].lat),
      ])
      .setPopup(popup)
      .addTo(map);

    // Arrow icon for directions.
    map
      .loadImage("/icons/from_library/bootstrap_arrow_right.png")
      .then((image) => {
        if (image) {
          map.addImage("route-direction-arrow", image.data);
        }
      });

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
</style>
