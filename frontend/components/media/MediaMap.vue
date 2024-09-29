<template>
  <div
    id="map"
    class="card-style-base dark:brightness-95 dark:contrast-[90%] dark:hue-rotate-180 dark:invert"
  ></div>
</template>

<script setup lang="ts">
import MapLibreGlDirections, {
  layersFactory,
} from "@maplibre/maplibre-gl-directions";
import maplibregl, { Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const props = defineProps<{
  markerColors: string[];
  eventNames: string[];
  eventLocations: string[];
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

const applyMaxWindowHeight = () => {
  const container = document.getElementById("container");
  if (container) {
    container.requestFullscreen();
  }
};

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
    }
    return false;
  }
  // WebGL not supported.
  return false;
}

// MARK: Routing

const bikeDirectionsIcon = `/icons/map/bike_directions_${colorMode.value}.png`;
const walkDirectionsIcon = `/icons/map/walk_directions_${colorMode.value}.png`;

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
    title="Change profile [p]"
    id=${routeProfileOptions.FOOT}
    style="
    background-image: url(${walkDirectionsIcon});
    width: 30px;
    height: 30px;
    background-size: 30px 30px;
    border-radius: 5px;
    box-shadow: 0 0 1px 2px rgba(0, 0, 0, 0.15);
    cursor: pointer"
    opacity: 5;
  >
  `;

const bikeRouteProfileControl = `
  <div
    title="Change profile [p]"
    id=${routeProfileOptions.BIKE}
    style="
    background-image: url(${bikeDirectionsIcon});
    width: 30px;
    height: 30px;
    background-size: 30px 30px;
    border-radius: 5px;
    box-shadow: 0 0 1px 2px rgba(0, 0, 0, 0.15);
    cursor: pointer"
    opacity: 5;
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

// MARK: Map Creation

onMounted(() => {
  const nominatimLocationRequest =
    "https://nominatim.openstreetmap.org/search?q=Brandenburg%20Gate%20Berlin&format=json";

  fetch(nominatimLocationRequest)
    .then((response) => response.json())
    .then((data) => {
      const location = data[0];
      if (!isWebglSupported()) {
        alert(i18n.t("components.media_map.maplibre_gl_alert"));
      } else {
        const map = new maplibregl.Map({
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
                  '<a href="https://www.cyclosm.org" target="_blank">CyclOSM</a> hosted by <a href="https://openstreetmap.fr" target="_blank">OSM France</a>',
              },
            },
            layers: [
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
                maxzoom: 24,
              },
              {
                id: "cycle-layer",
                type: "raster",
                source: "cycle-raster-tiles",
                minzoom: 0,
                maxzoom: 20,
                layout: {
                  visibility: "none",
                },
              },
            ],
          },
          center: [parseFloat(location["lon"]), parseFloat(location["lat"])],
          zoom: 15,
          pitch: 20,
        });

        // MARK: Basic Controls

        map.addControl(
          new maplibregl.NavigationControl({
            visualizePitch: true,
          }),
          "top-left"
        );
        map.addControl(
          new maplibregl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
            },
            trackUserLocation: true,
          })
        );
        map.addControl(new maplibregl.FullscreenControl());
        map.on("resize", () => applyMaxWindowHeight());

        const popup = new maplibregl.Popup({
          offset: 25,
        }).setHTML(
          `<div style="
            text-align: center;
            color: grey;"
          >
            <div style="font-size: 13px;">${props.eventNames[0]}</div>
            <div style="color: grey;">${props.eventLocations[0]}</div>
          </div>`
        );

        const marker = new maplibregl.Marker({
          color: `${props.markerColors[0]}`,
        });

        marker.addClassName("cursor-pointer");
        marker
          .setLngLat([parseFloat(location["lon"]), parseFloat(location["lat"])])
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

          let directions = new MapLibreGlDirections(map, {
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

          // MARK: Profile Switcher

          map.addControl(
            {
              onAdd: function () {
                const div = document.createElement("div");
                div.className = "maplibregl-ctrl maplibregl-ctrl-custom-image";
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
                    layers,
                  });

                  directions.interactive = true;
                  marker.getElement().addEventListener("mouseenter", () => {
                    directions.interactive = false;
                  });

                  marker.getElement().addEventListener("mouseleave", () => {
                    directions.interactive = true;
                  });
                };

                if (window.innerWidth < 768) {
                  div.addEventListener("touched", updateSelectedProfile);
                  div.addEventListener("click", updateSelectedProfile);
                } else {
                  div.addEventListener("click", updateSelectedProfile);
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
            "top-right"
          );

          // MARK: Clear Directions

          const clearDirectionsControl = `
            <div style="
              background-color: rgba(255, 255, 255, 1);
              padding: 1px 5px;
              border-radius: 5px;
              box-shadow: 0 0 1px 2px rgba(0, 0, 0, 0.15);
              color: grey;
              cursor: pointer"
            >
              Clear directions
            </div>
          `;

          const clearDirectionsHotkeyControl = `
          <div style="
            background-color: rgba(255, 255, 255, 1);
            padding: 1px 5px;
            border-radius: 5px;
            box-shadow: 0 0 1px 2px rgba(0, 0, 0, 0.15);
            color: grey;
            cursor: pointer;"
          >
            Clear directions [x]
          </div>
        `;

          map.addControl(
            {
              onAdd: function () {
                const div = document.createElement("div");
                div.className = "maplibregl-ctrl";
                if (window.innerWidth < 768) {
                  div.innerHTML = clearDirectionsControl;
                  div.addEventListener("touchend", () => directions.clear());
                  div.addEventListener("click", () => directions.clear()); // for small desktops or tiling
                } else {
                  div.innerHTML = clearDirectionsHotkeyControl;
                  div.addEventListener("click", () => directions.clear());
                  document.addEventListener("keydown", (event) => {
                    if (event.key === "x") {
                      directions.clear();
                    }
                  });
                }
                return div;
              },
              onRemove: function () {},
            },
            "bottom-left"
          );
        });
      }
    });
});
</script>
