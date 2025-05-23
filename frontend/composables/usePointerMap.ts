// SPDX-License-Identifier: AGPL-3.0-or-later

import MapLibreGlDirections, {
  layersFactory,
} from "@maplibre/maplibre-gl-directions";
import maplibregl, { type LayerSpecification } from "maplibre-gl";

import type { Location } from "~/types/content/location";
import type { EventType } from "~/types/events/event";

import { colorByType, type RouteProfile } from "~/types/map";

export const usePointerMap = () => {
  const i18n = useI18n();
  const createPointerMarker = (
    color: string,
    latitude: { lon: string; lat: string },
    popup?: maplibregl.Popup
  ) => {
    const marker = new maplibregl.Marker({
      color,
    });

    marker.addClassName("cursor-pointer");
    marker
      .setLngLat([parseFloat(latitude.lon), parseFloat(latitude.lat)])
      .setPopup(popup);
    return marker;
  };
  const createMapForMarkerTypeMap = (
    map: maplibregl.Map,
    event: { name: string; location: Location; type: EventType },
    isTouchDevice: boolean,
    selectedRoute: RouteProfile | undefined,
    eventType: EventType,
    popUp: maplibregl.Popup,
    fn?: () => void
  ) => {
    map.fitBounds(
      [
        [
          parseFloat(event.location.bbox[2]),
          parseFloat(event.location.bbox[0]),
        ],
        [
          parseFloat(event.location.bbox[3]),
          parseFloat(event.location.bbox[1]),
        ],
      ],
      {
        duration: 0,
        padding: 120,
      }
    );
    const navigationControl = createNavigationControl();

    map.addControl(navigationControl, "top-right");

    // Add localized tooltips for NavigationControl buttons.
    const zoomInButton: HTMLElement | null = map
      .getContainer()
      .querySelector(".maplibregl-ctrl-zoom-in");
    if (zoomInButton) {
      zoomInButton.title = i18n.t("i18n.composables.use_pointer_map.zoom_in");
    }

    const zoomOutButton: HTMLElement | null = map
      .getContainer()
      .querySelector(".maplibregl-ctrl-zoom-out");
    if (zoomOutButton) {
      zoomOutButton.title = i18n.t("i18n.composables.use_pointer_map.zoom_out");
    }

    const compassButton: HTMLElement | null = map
      .getContainer()
      .querySelector(".maplibregl-ctrl-compass");
    if (compassButton) {
      compassButton.title = i18n.t(
        "i18n.composables.use_pointer_map.reset_north"
      );
    }

    // Localize GeolocateControl.
    const geoLocateControl = createGeoLocateControl();
    map.addControl(geoLocateControl);

    const geolocateButton: HTMLElement | null = map
      .getContainer()
      .querySelector(".maplibregl-ctrl-geolocate");
    if (geolocateButton) {
      geolocateButton.title = i18n.t(
        "i18n.composables.use_pointer_map.geolocate"
      );
    }

    // Arrow icon for directions.
    map
      .loadImage("/icons/from_library/bootstrap_arrow_right.png")
      .then((image) => {
        if (image) {
          map.addImage("route-direction-arrow", image.data);
        }
      });

    const marker = createPointerMarker(
      colorByType[eventType || "learn"],
      event.location,
      popUp
    ).addTo(map);

    map.on("load", () => {
      const layers = layersFactory(
        isTouchDevice ? 1.5 : 1,
        isTouchDevice ? 2 : 1
      );

      // MARK: Directions Layer

      // Add arrow to directions layer.
      addDirectionsLayer(map, layers, selectedRoute as RouteProfile, marker);

      if (fn) {
        fn();
      }
    });
  };

  const addDirectionsLayer = (
    map: maplibregl.Map,
    layers: LayerSpecification[],
    selectedRoute: RouteProfile,
    marker: maplibregl.Marker
  ) => {
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

    const directions = new MapLibreGlDirections(map, {
      ...selectedRoute,
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

  const createNavigationControl = () => {
    return new maplibregl.NavigationControl({
      visualizePitch: true,
    });
  };

  const createGeoLocateControl = () => {
    return new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });
  };

  return {
    createPointerMarker,
    createMapForMarkerTypeMap,
  };
};
export default usePointerMap;
