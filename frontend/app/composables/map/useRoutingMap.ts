// SPDX-License-Identifier: AGPL-3.0-or-later
import type { IControl, LayerSpecification, Map, Marker } from "maplibre-gl";

import MapLibreGlDirections from "@maplibre/maplibre-gl-directions";
import { ref, shallowRef } from "vue";

const DIRECTION_ARROW_LAYER_ID =
  "maplibre-gl-directions-route-line-direction-arrow";

interface RouteProfileOption {
  FOOT: "foot";
  BIKE: "bike";
  DRIVING: "driving";
  CAR: "car";
}

const routeProfileOptions: RouteProfileOption = {
  FOOT: "foot",
  BIKE: "bike",
  DRIVING: "driving",
  CAR: "car",
};

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

// Shared reactive routing state across map composables and MediaMap so
// directions, controls, and cleanup operate on a single active map lifecycle.
// Use shallowRef for external MapLibre instances so object identity (===)
// is preserved for map.removeControl() and internal MapLibre checks.
const directionsRef = shallowRef<MapLibreGlDirections | null>(null);
const mapRef = shallowRef<Map | null>(null);
const markerRef = shallowRef<Marker | null>(null);
const mapLayersRef = shallowRef<LayerSpecification[]>([]);
const activeProfile = ref<"foot" | "bike">(routeProfileOptions.FOOT);
const currentProfile = ref("");
const selectedRoute = ref<RouteProfile | undefined>(
  routeProfileMap.find((item) => item.profile === routeProfileOptions.FOOT)
);
const routeProfileControlRef = shallowRef<IControl | null>(null);
const directionsControlRef = shallowRef<IControl | null>(null);
let routeKeydownController: AbortController | null = null;
let directionsKeydownController: AbortController | null = null;

const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  return (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT" ||
    target.isContentEditable
  );
};

const safeRemoveControl = (
  map: Map | null,
  controlRef: { value: IControl | null },
  elementId: string
) => {
  if (map && controlRef.value && typeof map.removeControl === "function") {
    try {
      map.removeControl(controlRef.value);
    } catch {
      // Control may already be detached if the map is tearing down.
    }
  }
  controlRef.value = null;
  document.getElementById(elementId)?.remove();
};

export const useRouting = () => {
  const { t } = useI18n();

  const bikeDirectionsIcon = `/icons/map/bike_directions.png`;
  const walkDirectionsIcon = `/icons/map/walk_directions.png`;

  const walkingRouteProfileControl = `
    <div
      title="${t("i18n.composables.use_routing_map.change_profile")}"
      id=${routeProfileOptions.FOOT}
      style="
      background-image: url(${walkDirectionsIcon});
      width: 1.875rem;
      height: 1.875rem;
      background-size: 1.875rem 1.875rem;
      border-radius: 0.3125rem;
      box-shadow: 0 0 1px 2px rgba(0, 0, 0, 0.15);
      cursor: pointer"
    ></div>`;

  const bikeRouteProfileControl = `
    <div
      title="${t("i18n.composables.use_routing_map.change_profile")}"
      id=${routeProfileOptions.BIKE}
      style="
      background-image: url(${bikeDirectionsIcon});
      width: 1.875rem;
      height: 1.875rem;
      background-size: 1.875rem 1.875rem;
      border-radius: 0.3125rem;
      box-shadow: 0 0 1px 2px rgba(0, 0, 0, 0.15);
      cursor: pointer"
    ></div>`;

  if (!currentProfile.value) {
    currentProfile.value = walkingRouteProfileControl;
  }

  const getProfileHtml = () =>
    activeProfile.value === routeProfileOptions.FOOT
      ? walkingRouteProfileControl
      : bikeRouteProfileControl;

  const setMapLayers = (newMapLayers: LayerSpecification[]) => {
    mapLayersRef.value = newMapLayers.filter(
      (layer) => layer.id !== DIRECTION_ARROW_LAYER_ID
    );
  };

  const setDirections = (newDirections: MapLibreGlDirections) => {
    directionsRef.value = newDirections;
  };

  const setMarker = (newMarker: Marker) => {
    markerRef.value = newMarker;
  };

  const setMap = (newMap: Map) => {
    mapRef.value = newMap;
  };

  const mapProfile = (profile: string) => {
    return routeProfileMap.find((item) => item.profile === profile);
  };

  const toggleLayerHandler = (map: Map) => {
    if (typeof map.getLayer === "function" && !map.getLayer("cycle-layer")) {
      return;
    }
    if (activeProfile.value === routeProfileOptions.FOOT) {
      map.setLayoutProperty("cycle-layer", "visibility", "visible");
    } else {
      map.setLayoutProperty("cycle-layer", "visibility", "none");
    }
  };

  const routeProfileHandler = () => {
    activeProfile.value =
      activeProfile.value === routeProfileOptions.FOOT
        ? routeProfileOptions.BIKE
        : routeProfileOptions.FOOT;
    currentProfile.value = getProfileHtml();
    return currentProfile.value;
  };

  const setSelectedRoute = () => {
    selectedRoute.value = mapProfile(activeProfile.value);
    return selectedRoute.value;
  };

  const addDirectionsLayer = (
    map: Map,
    layers: LayerSpecification[],
    route: RouteProfile
  ) => {
    const baseLayers = layers.filter(
      (layer) => layer.id !== DIRECTION_ARROW_LAYER_ID
    );
    const directionsLayers: LayerSpecification[] = [
      ...baseLayers,
      {
        id: DIRECTION_ARROW_LAYER_ID,
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
        paint: { "icon-opacity": 1 },
        filter: ["==", ["get", "route"], "SELECTED"],
      },
    ];
    const directions = new MapLibreGlDirections(map, {
      ...route,
      requestOptions: { alternatives: "true" },
      layers: directionsLayers,
    });
    directions.interactive = true;
    setMapLayers(baseLayers);
    setDirections(directions);
    return directions;
  };

  const resetRouteProfileControl = () => {
    const map = mapRef.value as unknown as Map | null;
    if (!map) {
      return;
    }

    safeRemoveControl(map, routeProfileControlRef, "route-profile-control");
    routeKeydownController?.abort();
    routeKeydownController = null;

    let isSwitchingProfile = false;

    const control: IControl = {
      onAdd: () => {
        const div = document.createElement("div");
        div.className = "maplibregl-ctrl maplibregl-ctrl-custom-image";
        div.id = "route-profile-control";
        currentProfile.value = getProfileHtml();
        div.innerHTML = currentProfile.value;

        const updateSelectedProfile = () => {
          if (isSwitchingProfile) {
            return;
          }
          isSwitchingProfile = true;
          try {
            toggleLayerHandler(map);

            if (directionsRef.value) {
              directionsRef.value.destroy();
            }

            div.innerHTML = routeProfileHandler();
            const nextRoute = setSelectedRoute() as RouteProfile;
            addDirectionsLayer(map, mapLayersRef.value, nextRoute);
            resetDirectionsControl({ skipProfileReset: true });
          } finally {
            isSwitchingProfile = false;
          }
        };

        div.addEventListener("click", updateSelectedProfile);
        if (window.innerWidth < 768) {
          div.addEventListener("touchend", (event) => {
            event.preventDefault();
            updateSelectedProfile();
          });
        } else {
          routeKeydownController = new AbortController();
          document.addEventListener(
            "keydown",
            (event) => {
              if (!isEditableTarget(event.target) && event.key === "p") {
                updateSelectedProfile();
              }
            },
            { signal: routeKeydownController.signal }
          );
        }

        return div;
      },
      onRemove: () => {
        routeKeydownController?.abort();
        routeKeydownController = null;
      },
    };

    routeProfileControlRef.value = control;
    map.addControl(control, "top-left");
  };

  const resetDirectionsControl = (
    options: { skipProfileReset?: boolean } = {}
  ) => {
    const map = mapRef.value;
    const directions = directionsRef.value;
    if (!map || !directions) {
      return;
    }

    safeRemoveControl(map, directionsControlRef, "directions-control");
    directionsKeydownController?.abort();
    directionsKeydownController = null;

    const control: IControl = {
      onAdd: () => {
        const div = document.createElement("div");
        div.className = "maplibregl-ctrl";
        div.id = "directions-control";

        let label =
          directions.waypoints.length === 0
            ? t("i18n.composables.use_routing_map.click_for_directions")
            : t("i18n.composables.use_routing_map.clear_directions");

        const tooltip =
          directions.waypoints.length === 0
            ? t("i18n.composables.use_routing_map.click_for_directions_tooltip")
            : t("i18n.composables.use_routing_map.clear_directions_tooltip");

        if (window.innerWidth >= 768 && directions.waypoints.length !== 0) {
          label += " [x]";
        }

        div.innerHTML = `<div title="${tooltip}" style="background-color: rgba(255,255,255,0.75); padding: 1px 5px; border-radius: 0.3125rem; box-shadow: 0 0 1px 2px rgba(0,0,0,0.15); color: rgba(0,0,0,0.8); cursor: pointer">${label}</div>`;

        const clearDirections = () => {
          directions.clear();
          resetDirectionsControl({ skipProfileReset: true });
        };

        div.addEventListener("click", clearDirections);
        if (window.innerWidth < 768) {
          div.addEventListener("touchend", (event) => {
            event.preventDefault();
            clearDirections();
          });
        } else {
          directionsKeydownController = new AbortController();
          document.addEventListener(
            "keydown",
            (event) => {
              if (!isEditableTarget(event.target) && event.key === "x") {
                clearDirections();
              }
            },
            { signal: directionsKeydownController.signal }
          );
        }

        return div;
      },
      onRemove: () => {
        directionsKeydownController?.abort();
        directionsKeydownController = null;
      },
    };

    directionsControlRef.value = control;
    map.addControl(control, "top-left");

    if (!options.skipProfileReset && !routeProfileControlRef.value) {
      resetRouteProfileControl();
    }
  };

  const cleanupRouting = () => {
    routeKeydownController?.abort();
    routeKeydownController = null;
    directionsKeydownController?.abort();
    directionsKeydownController = null;

    if (directionsRef.value) {
      try {
        directionsRef.value.destroy();
      } catch {
        // Ignore if the underlying map instance has already been destroyed.
      }
    }

    safeRemoveControl(mapRef.value, directionsControlRef, "directions-control");
    safeRemoveControl(
      mapRef.value,
      routeProfileControlRef,
      "route-profile-control"
    );

    directionsRef.value = null;
    mapRef.value = null;
    markerRef.value = null;
    mapLayersRef.value = [];
    activeProfile.value = routeProfileOptions.FOOT;
    currentProfile.value = walkingRouteProfileControl;
    selectedRoute.value = mapProfile(routeProfileOptions.FOOT);
  };

  return {
    routeProfileHandler,
    setSelectedRoute,
    toggleLayerHandler,
    selectedRoute,
    currentProfile,
    directionsRef,
    walkingRouteProfileControl,
    bikeRouteProfileControl,
    resetDirectionsControl,
    mapProfile,
    routeProfileMap,
    resetRouteProfileControl,
    addDirectionsLayer,
    setDirections,
    setMarker,
    setMap,
    setMapLayers,
    cleanupRouting,
  };
};
