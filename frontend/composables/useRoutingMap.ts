// SPDX-License-Identifier: AGPL-3.0-or-later
import type maplibregl from "maplibre-gl";
import type { LayerSpecification } from "maplibre-gl";

import MapLibreGlDirections from "@maplibre/maplibre-gl-directions";
import { ref } from "vue";

import type { RouteProfile } from "~/types/map";

export const useRouting = () => {
  const i18n = useI18n();
  const bikeDirectionsIcon = `/icons/map/bike_directions.png`;
  const walkDirectionsIcon = `/icons/map/walk_directions.png`;
  const directionsRef = ref<MapLibreGlDirections | null>(null);
  const mapRef = ref<maplibregl.Map | null>(null);
  const markerRef = ref<maplibregl.Marker | null>(null);
  const mapLayersRef = ref<LayerSpecification[]>([]);

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
      title="${i18n.t("i18n.composables.use_routing_map.change_profile")}"
      id=${routeProfileOptions.FOOT}
      style="
      background-image: url(${walkDirectionsIcon});
      width: 30px;
      height: 30px;
      background-size: 30px 30px;
      border-radius: 5px;
      box-shadow: 0 0 1px 2px rgba(0, 0, 0, 0.15);
      cursor: pointer"
    ></div>`;

  const bikeRouteProfileControl = `
    <div
      title="${i18n.t("i18n.composables.use_routing_map.change_profile")}"
      id=${routeProfileOptions.BIKE}
      style="
      background-image: url(${bikeDirectionsIcon});
      width: 30px;
      height: 30px;
      background-size: 30px 30px;
      border-radius: 5px;
      box-shadow: 0 0 1px 2px rgba(0, 0, 0, 0.15);
      cursor: pointer"
    ></div>`;

  const currentProfile = ref(walkingRouteProfileControl);
  const selectedRoute = ref<RouteProfile | undefined>(
    routeProfileMap.find((item) => item.profile === routeProfileOptions.FOOT)
  );

  const setMapLayers = (newMapLayers: LayerSpecification[]) => {
    mapLayersRef.value = newMapLayers;
  };

  const setDirections = (newDirections: MapLibreGlDirections) => {
    directionsRef.value = newDirections;
  };

  const setMarker = (newMarker: maplibregl.Marker) => {
    markerRef.value = newMarker;
  };

  const setMap = (newMap: maplibregl.Map) => {
    mapRef.value = newMap;
  };

  const mapProfile = (profile: string) => {
    return routeProfileMap.find((item) => item.profile === profile);
  };

  const toggleLayerHandler = (map: maplibregl.Map) => {
    if (currentProfile.value === walkingRouteProfileControl) {
      map.setLayoutProperty("cycle-layer", "visibility", "visible");
    } else {
      map.setLayoutProperty("cycle-layer", "visibility", "none");
    }
  };

  const routeProfileHandler = () => {
    currentProfile.value =
      currentProfile.value === walkingRouteProfileControl
        ? bikeRouteProfileControl
        : walkingRouteProfileControl;
    return currentProfile.value;
  };

  const setSelectedRoute = () => {
    selectedRoute.value =
      currentProfile.value === walkingRouteProfileControl
        ? mapProfile(routeProfileOptions.FOOT)
        : mapProfile(routeProfileOptions.BIKE);
    return selectedRoute.value;
  };

  const resetRouteProfileControl = () => {
    const existing = document.getElementById("route-profile-control");
    if (existing) {
      existing.remove();
    }

    const map = mapRef.value as unknown as maplibregl.Map;
    if (!map) {
      return;
    }

    map.addControl(
      {
        onAdd: function () {
          const div = document.createElement("div");
          div.className = "maplibregl-ctrl maplibregl-ctrl-custom-image";
          div.id = "route-profile-control";
          div.innerHTML = currentProfile.value;

          const updateSelectedProfile = () => {
            toggleLayerHandler(map);

            if (directionsRef.value) {
              directionsRef.value.destroy();
            }

            div.innerHTML = routeProfileHandler();
            selectedRoute.value = setSelectedRoute() as RouteProfile;
            const mapLayers =
              mapLayersRef.value as unknown as LayerSpecification[];
            const newDirections = addDirectionsLayer(
              map,
              mapLayers,
              selectedRoute.value as RouteProfile
            );

            newDirections.interactive = true;

            const marker = markerRef.value as unknown as maplibregl.Marker;
            if (!marker) {
              return;
            }

            marker.getElement().addEventListener("mouseenter", () => {
              newDirections.interactive = false;
            });
            marker.getElement().addEventListener("mouseleave", () => {
              newDirections.interactive = true;
            });
          };

          div.addEventListener("click", updateSelectedProfile);
          if (window.innerWidth < 768) {
            div.addEventListener("touchend", updateSelectedProfile);
          } else {
            document.addEventListener("keydown", (event) => {
              if (event.key === "p") {
                updateSelectedProfile();
              }
            });
          }

          return div;
        },
        onRemove: () => {},
      },
      "top-left"
    );
  };

  const resetDirectionsControl = () => {
    const map = mapRef.value;
    const directions = directionsRef.value;
    if (!map || !directions) {
      return;
    }

    const existing = document.getElementById("directions-control");
    if (existing) {
      existing.remove();
    }

    map.addControl(
      {
        onAdd: function () {
          const div = document.createElement("div");
          div.className = "maplibregl-ctrl";
          div.id = "directions-control";

          let label =
            directions.waypoints.length === 0
              ? i18n.t("i18n.composables.use_routing_map.click_for_directions")
              : i18n.t("i18n.composables.use_routing_map.clear_directions");

          const tooltip =
            directions.waypoints.length === 0
              ? i18n.t(
                  "i18n.composables.use_routing_map.click_for_directions_tooltip"
                )
              : i18n.t(
                  "i18n.composables.use_routing_map.clear_directions_tooltip"
                );

          if (window.innerWidth >= 768 && directions.waypoints.length !== 0) {
            label += " [x]";
          }

          div.innerHTML = `<div title="${tooltip}" style="background-color: rgba(255,255,255,0.75); padding: 1px 5px; border-radius: 5px; box-shadow: 0 0 1px 2px rgba(0,0,0,0.15); color: rgba(0,0,0,0.8); cursor: pointer">${label}</div>`;

          div.addEventListener("click", () => {
            directions.clear();
            resetDirectionsControl();
          });
          if (window.innerWidth < 768) {
            div.addEventListener("touchend", () => {
              directions.clear();
              resetDirectionsControl();
            });
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
        onRemove: () => {},
      },
      "top-left"
    );

    resetRouteProfileControl();
  };

  const addDirectionsLayer = (
    map: maplibregl.Map,
    layers: LayerSpecification[],
    selectedRoute: RouteProfile
  ) => {
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
      paint: { "icon-opacity": 1 },
      filter: ["==", ["get", "route"], "SELECTED"],
    });
    const directions = new MapLibreGlDirections(map, {
      ...selectedRoute,
      requestOptions: { alternatives: "true" },
      layers,
    });
    setMapLayers(layers);
    setDirections(directions);
    return directions;
  };

  return {
    routeProfileHandler,
    setSelectedRoute,
    toggleLayerHandler,
    selectedRoute,
    currentProfile,
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
  };
};
