<template>
  <div
    id="map"
    class="card-style-base dark:brightness-95 dark:contrast-[90%] dark:hue-rotate-180 dark:invert"
  ></div>
</template>
<script setup lang="ts">
import MapLibreGlDirections, { layersFactory } from "@maplibre/maplibre-gl-directions";
import maplibregl, { type Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const props = defineProps<{
  markerColors: string[];
  eventNames: string[];
  eventLocations: string[];
}>();

const i18n = useI18n();
const colorMode = useColorMode();

// Function to check WebGL support
function isWebglSupported() {
  if (window.WebGLRenderingContext) {
    const canvas = document.createElement("canvas");
    try {
      const context = canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (context && typeof context.getParameter == "function") {
        return true;
      }
    } catch (e) {
      console.log(e);
    }
    return false;
  }
  return false;
}

// Routing Profiles
const routeProfileOptions = {
  FOOT: "foot",
  BIKE: "bike",
};
const routingAPI = "https://routing.openstreetmap.de/routed-";
const routingAPIVersion = "/route/v1/";
const routeProfileMap = [
  {
    api: `${routingAPI}${routeProfileOptions.FOOT}${routingAPIVersion}`,
    profile: routeProfileOptions.FOOT,
  },
  {
    api: `${routingAPI}${routeProfileOptions.BIKE}${routingAPIVersion}`,
    profile: routeProfileOptions.BIKE,
  },
];
let currentProfile = routeProfileOptions.FOOT;

// Utility to fetch selected route profile
const mapProfile = (profile: string) =>
  routeProfileMap.find((item) => item.profile === profile);

let selectedRoute = mapProfile(routeProfileOptions.FOOT);

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
            },
            layers: [
              {
                id: "background",
                type: "background",
                paint: {
                  "background-color": colorMode.preference == "dark" ? "#131316" : "#F6F8FA",
                },
              },
              {
                id: "default-layer",
                type: "raster",
                source: "raster-tiles",
                minzoom: 0,
                maxzoom: 24,
              },
            ],
          },
          center: [parseFloat(location["lon"]), parseFloat(location["lat"])],
          zoom: 15,
          pitch: 20,
        });

        // Add Controls
        map.addControl(new maplibregl.NavigationControl(), "top-left");
        map.addControl(new maplibregl.FullscreenControl());

        // Add Marker
        const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
          `<div>${props.eventNames[0]}</div><div>${props.eventLocations[0]}</div>`
        );

        const marker = new maplibregl.Marker({ color: `${props.markerColors[0]}` })
          .setLngLat([parseFloat(location["lon"]), parseFloat(location["lat"])])
          .setPopup(popup)
          .addTo(map);

        // Add Routing Layer
        let directions = new MapLibreGlDirections(map, {
          ...(selectedRoute = mapProfile(currentProfile)),
        });

        map.addControl(
          {
            onAdd: function () {
              const div = document.createElement("div");
              div.innerHTML = "Toggle Profile";
              div.onclick = () => {
                currentProfile =
                  currentProfile === routeProfileOptions.FOOT
                    ? routeProfileOptions.BIKE
                    : routeProfileOptions.FOOT;
                directions.destroy();
                directions = new MapLibreGlDirections(map, {
                  ...(selectedRoute = mapProfile(currentProfile)),
                });
              };
              return div;
            },
            onRemove: function () {},
          },
          "top-right"
        );
      }
    });
});
</script>
