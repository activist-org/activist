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
import WalkingIconPng from "~/assets/images/WalkingIconPng.png";

// const walkingIconSvgData = WalkingIcon;
// const walkingIconURI = `data:image/svg+xml;base64,${btoa(walkingIconSvgData)}`; // output: data:image/svg+xml;base64,L19udXh0L2Fzc2V0cy9pbWFnZXMvV2Fsa2luZ0ljb24uc3Zn

// const walkingIconURI = `data:image/svg+xml,%3csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cg clip-path='url(%23clip0_9992_5290)'%3e%3cpath d='M12.9996 3C12.9996 3.79565 13.3157 4.55871 13.8783 5.12132C14.4409 5.68393 15.204 6 15.9996 6C16.7953 6 17.5584 5.68393 18.121 5.12132C18.6836 4.55871 18.9996 3.79565 18.9996 3C18.9996 2.20435 18.6836 1.44129 18.121 0.87868C17.5584 0.31607 16.7953 0 15.9996 0C15.204 0 14.4409 0.31607 13.8783 0.87868C13.3157 1.44129 12.9996 2.20435 12.9996 3ZM19.1196 7.504C18.9791 7.34572 18.8066 7.21898 18.6136 7.13212C18.4206 7.04525 18.2113 7.00023 17.9996 7H15.1096C13.6256 7 12.4696 8.286 12.6236 9.76L13.4836 17.926C13.5124 18.1951 13.5715 18.4601 13.6596 18.716L14.2956 20.528L13.8696 21.012C13.7787 21.1182 13.702 21.2359 13.6416 21.362L9.64164 29.862C9.55178 30.041 9.49866 30.2361 9.48541 30.4359C9.47216 30.6357 9.49906 30.8362 9.56451 31.0254C9.62996 31.2147 9.73265 31.3889 9.8665 31.5378C10.0004 31.6868 10.1627 31.8074 10.3439 31.8926C10.5251 31.9778 10.7216 32.0258 10.9217 32.0339C11.1218 32.042 11.3214 32.0099 11.5089 31.9396C11.6964 31.8693 11.8679 31.7621 12.0134 31.6244C12.1588 31.4868 12.2752 31.3214 12.3556 31.138L16.2676 22.83L19.6276 18.988C19.8862 18.6942 20.0197 18.3109 19.9996 17.92L19.7236 12.694L20.5936 13.672L21.5216 19.244C21.5869 19.6365 21.8054 19.987 22.1291 20.2185C22.4528 20.4499 22.8551 20.5432 23.2476 20.478C23.6402 20.4128 23.9907 20.1943 24.2221 19.8706C24.4535 19.5469 24.5469 19.1445 24.4816 18.752L23.4816 12.752C23.4348 12.4731 23.31 12.2131 23.1216 12.002L19.1216 7.502L19.1196 7.504Z' fill='black' fill-opacity='0.8'/%3e%3cpath d='M19.4995 23.49V20.654L17.0915 23.404L16.5695 24.452C16.6237 24.618 16.7048 24.7741 16.8095 24.914L21.8095 31.414C22.0519 31.7296 22.4098 31.9359 22.8043 31.9877C23.1989 32.0395 23.5979 31.9324 23.9135 31.69C24.2291 31.4475 24.4355 31.0897 24.4872 30.6951C24.539 30.3005 24.4319 29.9016 24.1895 29.586L19.4995 23.49ZM11.0595 15.06L12.0475 14.072L11.6375 10.386L11.6255 10.252L9.3775 12.5H6.4975C6.09967 12.5 5.71814 12.658 5.43684 12.9393C5.15553 13.2206 4.9975 13.6021 4.9975 14C4.9975 14.3978 5.15553 14.7793 5.43684 15.0606C5.71814 15.3419 6.09967 15.5 6.4975 15.5H9.9995C10.1967 15.5 10.3921 15.4612 10.5743 15.3857C10.7565 15.3102 10.9221 15.1995 11.0615 15.06H11.0595Z' fill='black' fill-opacity='0.8'/%3e%3c/g%3e%3cdefs%3e%3cclipPath id='clip0_9992_5290'%3e%3crect width='32' height='32' fill='white' transform='matrix(-1 0 0 1 32 0)'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e`;
// console.log("walkingIconUrl", walkingIconURI);

// const walkingImage = new Image();
// walkingImage.src = walkingIconURI;
// walkingImage.style.width = '32px';
// walkingImage.style.height = '32px';

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

const routeProfileOptions = {
  FOOT: "foot",
  BIKE: "bike",
  DRIVING: "driving",
  CAR: "car",
};

const routingAPI = "https://routing.openstreetmap.de/routed-";
const routingAPIVersion = "/route/v1/";

const routeProfileMap = [
  {
    profile: routeProfileOptions.FOOT,
    api: `${routingAPI}${routeProfileOptions.FOOT}${routingAPIVersion}`,
  },
  {
    profile: routeProfileOptions.BIKE,
    api: `${routingAPI}${routeProfileOptions.BIKE}${routingAPIVersion}`,
  },
  {
    profile: routeProfileOptions.DRIVING,
    api: `${routingAPI}${routeProfileOptions.CAR}${routingAPIVersion}`,
  },
];

console.log("routeProfileMap", routeProfileMap[0]);

const mapProfile = (profile: string) => {
  return routeProfileMap.find(
    (routeProfile) => routeProfile.profile === profile
  );
};

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

        map.on('load', async () => {
          console.log("map loaded");
          // map.addImage("walking-icon", walkingImage, { sdf: true });

         const testingWalkImage = await map.loadImage(WalkingIconPng);
          map.addImage("walking-icon", testingWalkImage.data);
          map.addSource("point", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [parseFloat(location["lon"]), parseFloat(location["lat"])],
                  },
                  properties: {
                    title: props.eventNames[0],
                    description: props.eventLocations[0],
                  },
                },
              ],
            },
          });

          map.addLayer({
            id: "points",
            type: "symbol",
            source: "point",
            layout: {
              "icon-image": "walking-icon",
              "icon-size": 0.6,
              "icon-anchor": "top-left",
              "icon-offset": [0, 10],
              "icon-allow-overlap": true,
            },
          });
        });

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

          const selectedProfile = mapProfile(routeProfileOptions.FOOT);

          if (selectedProfile) {
            const directions = new MapLibreGlDirections(map, {
              ...selectedProfile,
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
          }
        });
      }
    });
});
</script>
