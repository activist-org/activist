// SPDX-License-Identifier: AGPL-3.0-or-later

import type maplibregl from "maplibre-gl";
import type { LayerSpecification } from "maplibre-gl";

import MapLibreGlDirections from "@maplibre/maplibre-gl-directions";

import type { RouteProfile } from "~/types/map";
export const useRouting = () => {
  const i18n = useI18n();
  const bikeDirectionsIcon = `/icons/map/bike_directions.png`;
  const walkDirectionsIcon = `/icons/map/walk_directions.png`;
  let directions: MapLibreGlDirections;
  let map: maplibregl.Map;
  let marker: maplibregl.Marker;
  let mapLayers: LayerSpecification[];
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
  >
  `;

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
  >
  `;

  let currentProfile = walkingRouteProfileControl;

  const setMapLayers = (newMapLayers: LayerSpecification[]) => {
    mapLayers = newMapLayers;
  };

  const setDirections = (newDirections: MapLibreGlDirections) => {
    directions = newDirections;
  };

  const setMarker = (newMarker: maplibregl.Marker) => {
    marker = newMarker;
  };

  const setMap = (newMap: maplibregl.Map) => {
    map = newMap;
  };

  const mapProfile = (profile: string) => {
    return routeProfileMap.find((item) => item.profile === profile);
  };

  let selectedRoute = mapProfile(routeProfileOptions.FOOT);

  const toggleLayerHandler = (map: maplibregl.Map) => {
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
              // @ts-expect-error: Will break route profile change.
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
            ? i18n.t("i18n.composables.use_routing_map.click_for_directions")
            : i18n.t("i18n.composables.use_routing_map.clear_directions");

        const directionsControlTooltip =
          directions.waypoints.length == 0
            ? i18n.t(
                "i18n.composables.use_routing_map.click_for_directions_tooltip"
              )
            : i18n.t(
                "i18n.composables.use_routing_map.clear_directions_tooltip"
              );

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
    if (!map) return;
    map.addControl(directionControl, "top-left");
    resetRouteProfileControl();
  }

  const addDirectionsLayer = (
    map: maplibregl.Map,
    layers: LayerSpecification[],
    selectedRoute: RouteProfile
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
