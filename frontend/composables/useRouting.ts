import type maplibregl from "maplibre-gl";

import MapLibreGlDirections from "@maplibre/maplibre-gl-directions";

export const useRouting = (map:maplibregl.Map, directions:MapLibreGlDirections, marker:maplibregl.Marker  ) => {
  const i18n = useI18n();
  const bikeDirectionsIcon = `/icons/map/bike_directions.png`;
  const walkDirectionsIcon = `/icons/map/walk_directions.png`;


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
    title="${i18n.t("i18n.components.media_map.change_profile")}"
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
    title="${i18n.t("i18n.components.media_map.change_profile")}"
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

const mapProfile = (profile: string) => {
  return routeProfileMap.find((item) => item.profile === profile);
};

let selectedRoute = mapProfile(routeProfileOptions.FOOT);

const toggleLayerHandler = () => {
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
          toggleLayerHandler();

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
}

  const directionControl = {
    onAdd: function () {
      const div = document.createElement("div");
      div.className = "maplibregl-ctrl";
      div.id = "directions-control";

      let directionsControlLabel =
        directions.waypoints.length == 0
          ? i18n.t("i18n.components.media_map.click_for_directions")
          : i18n.t("i18n.components.media_map.clear_directions");

      const directionsControlTooltip =
        directions.waypoints.length == 0
          ? i18n.t("i18n.components.media_map.click_for_directions_tooltip")
          : i18n.t("i18n.components.media_map.clear_directions_tooltip");

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
  directionControl,
  resetRouteProfileControl
}
}
