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
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const props = defineProps<{
  markerColors: string[];
  eventNames: string[];
  eventLocations: string[];
}>();

const i18n = useI18n();
const colorMode = useColorMode();

const isTouchDevice =
  // `maxTouchPoints` isn't recognized by TS. Safe to ignore.
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
    }
    return false;
  }
  // WebGL not supported.
  return false;
}

onMounted(() => {
  const nominatimLocationRequest =
    "https://nominatim.openstreetmap.org/search?q=Brandenburg%20Gate%20Berlin&format=json";

  fetch(nominatimLocationRequest)
    .then((response) => response.json())
    .then((data) => {
      const location = data[0];
      if (!isWebglSupported()) {
        alert(i18n.t("components.media-map.maplibre-gl-alert"));
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
                  '<a href="https://www.openstreetmap.org/about" target="_blank">Data &copy; OpenStreetMap contributors</a>',
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
                id: "simple-tiles",
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

        map.addControl(
          new maplibregl.NavigationControl({
            visualizePitch: true,
          }),
          "top-left"
        );
        map.addControl(new maplibregl.FullscreenControl());
        map.addControl(
          new maplibregl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
            },
            trackUserLocation: true,
          })
        );

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

        map.on("load", () => {
          const layers = layersFactory(
            isTouchDevice ? 1.5 : 1,
            isTouchDevice ? 2 : 1
          );

          const directions = new MapLibreGlDirections(map, {
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

          document.addEventListener("keydown", (event) => {
            if (event.key === "x") {
              directions.clear();
            }
          });

          // const clearDirectionsControl = `
          //   <div style="
          //     background-color: rgba(255, 255, 255, 1);
          //     padding: 1px 5px;
          //     margin: 10px;
          //     border-radius: 5px;
          //     box-shadow: 0 0 1px 2px rgba(0, 0, 0, 0.15);
          //     color: grey;"
          //   >
          //     Clear directions
          //   </div>
          // `;

          const clearDirectionsHotkeyControl = `
          <div style="
            background-color: rgba(255, 255, 255, 1);
            padding: 1px 5px;
            margin: 10px;
            border-radius: 5px;
            box-shadow: 0 0 1px 2px rgba(0, 0, 0, 0.15);
            color: grey;"
          >
            Clear directions [x]
          </div>
        `;

          if (window.innerWidth >= 768) {
            map.addControl(
              {
                onAdd: function () {
                  const div = document.createElement("div");
                  // if (window.innerWidth < 768) {
                  //   div.innerHTML = clearDirectionsControl;
                  // } else {
                  //   div.innerHTML = clearDirectionsHotkeyControl;
                  // }
                  div.innerHTML = clearDirectionsHotkeyControl;
                  return div;
                },
                onRemove: function () {},
              },
              "bottom-left"
            );
          }
        });
      }
    });
});
</script>
