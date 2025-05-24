// SPDX-License-Identifier: AGPL-3.0-or-later

import maplibregl, { type LayerSpecification } from "maplibre-gl";

import { useClusterMap } from "./useClusterMap";
import { usePointerMap } from "./usePointerMap";

export const useMap = () => {
  const { createMapForMarkerTypeMap } = usePointerMap();
  const { createMapForClusterTypeMap } = useClusterMap();
  const i18n = useI18n();

  function isWebglSupported() {
    if (window.WebGLRenderingContext) {
      const canvas = document.createElement("canvas");
      try {
        const context =
          canvas.getContext("webgl2") || canvas.getContext("webgl");
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

  const addDefaultControls = (map: maplibregl.Map) => {
    // MARK: Basic Controls

    // Localize FullscreenControl
    const fullscreenControl = createFullScreenControl();
    map.addControl(fullscreenControl);

    const fullscreenButton: HTMLElement | null = map
      .getContainer()
      .querySelector(".maplibregl-ctrl-fullscreen");
    // Add localized tooltips for NavigationControl buttons.
    const zoomInButton: HTMLElement | null = map
      .getContainer()
      .querySelector(".maplibregl-ctrl-zoom-in");
    if (zoomInButton) {
      zoomInButton.title = i18n.t("i18n.composables.use_map.zoom_in");
    }

    const zoomOutButton: HTMLElement | null = map
      .getContainer()
      .querySelector(".maplibregl-ctrl-zoom-out");
    if (zoomOutButton) {
      zoomOutButton.title = i18n.t("i18n.composables.use_map.zoom_out");
    }

    const compassButton: HTMLElement | null = map
      .getContainer()
      .querySelector(".maplibregl-ctrl-compass");
    if (compassButton) {
      compassButton.title = i18n.t("i18n.composables.use_map.reset_north");
    }
    const navigationControl = new maplibregl.NavigationControl({
      visualizePitch: true,
    });
    map.addControl(navigationControl);

    if (fullscreenButton)
      fullscreenButton.title = i18n.t("i18n.composables.use_map.fullscreen");
  };

  const createMap = (mapLayers: LayerSpecification[]) => {
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
              '<a href="https://www.cyclosm.org" target="_blank">CyclOSM</a>',
          },
        },
        layers: mapLayers,
      },
      center: [0, 20], // default center
      zoom: 1.5, // shows entire world
      minZoom: 1,
      maxZoom: 18,
      renderWorldCopies: false,
      cooperativeGestures: true,
    });
    // Remove automatic resize handler.
    map.on("load", () => {
      map.resize();
    });

    return map;
  };

  const createFullScreenControl = () => {
    return new maplibregl.FullscreenControl();
  };


  return {
    isWebglSupported,
    createMap,
    createFullScreenControl,
    createMapForMarkerTypeMap,
    createMapForClusterTypeMap,
    addDefaultControls,
  };
};
