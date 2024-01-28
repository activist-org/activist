<template>
  <div
    id="map"
    class="card-style-base dark:brightness-95 dark:contrast-[90%] dark:hue-rotate-180 dark:invert"
  ></div>
</template>

<script setup lang="ts">
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const props = defineProps<{ markerColors: string[]; isHidden: boolean }>();

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
  if (!isWebglSupported() && !props.isHidden) {
    alert("Your browser does not support MapLibre GL");
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
            id: "simple-tiles",
            type: "raster",
            source: "raster-tiles",
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      center: [13.38, 52.5168],
      zoom: 15,
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

    new maplibregl.Marker({ color: `${props.markerColors[0]}` })
      .setLngLat([13.3778, 52.5163])
      .addTo(map);
  }
});
</script>
