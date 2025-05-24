// SPDX-License-Identifier: AGPL-3.0-or-later

import MapLibreGlDirections, {
  layersFactory,
} from "@maplibre/maplibre-gl-directions";
import maplibregl, { type LayerSpecification } from "maplibre-gl";

import type { Location } from "~/types/content/location";
import type { EventType } from "~/types/events/event";

import { colorByType, type RouteProfile } from "~/types/map";

const organizationIcon = `/icons/map/tooltip_organization.png`;
const calendarIcon = `/icons/map/tooltip_datetime.png`;
const locationIcon = `/icons/map/tooltip_location.png`;
export const usePointerMap = () => {
  const i18n = useI18n();
  const createPointerMarker = (
    color: string,
    latitude: { lon: string; lat: string },
    attendLabel: string,
    event: {
      type: EventType;
      location: string;
      name: string;
      id:string
    }
  ) => {
    const marker = new maplibregl.Marker({
      color
    });
    marker.getElement().id = `pointer-${event.id}`;
    marker.addClassName("cursor-pointer");
    const popup = createPopUpForPointer({
      url: ``, // TODO: pass in event webpage URL
      organization: "Organization", // TODO: pass in event's organization name
      datetime: "Date & Time", // TODO: pass in event's date and time information
      attendLabel,
      eventType: event.type,
      location: event.location.split(",").slice(0, 3).join(", "),
      name: event.name,
    });
    marker
      .setLngLat([parseFloat(latitude.lon), parseFloat(latitude.lat)])
      .setPopup(popup);
    return marker;
  };
  const createMapForMarkerTypeMap = (
    map: maplibregl.Map,
    event: { name: string; location: Location; type: EventType, id: string },
    isTouchDevice: boolean,
    selectedRoute: RouteProfile | undefined,
    attendLabel: string,
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
      colorByType[event.type || "learn"],
      event.location,
      attendLabel,
      {
        type: event.type,
        location: event.location.displayName,
        name: event.name,
        id: event.id,
      }
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

  const buildExpandedTooltip = (opts: {
    name: string;
    url: string;
    organization: string;
    datetime: string;
    location: string;
    attendLabel: string;
    eventType: EventType;
  }) => {
    const root = document.createElement("div");
    root.className = "w-[220px] cursor-pointer font-sans";

    let tooltipClass = "";
    if (opts.eventType === "learn") {
      tooltipClass =
        "overflow-hidden bg-white rounded-sm border-l-8 border-l-[#2176AE]";
    } else {
      tooltipClass =
        "overflow-hidden bg-white rounded-sm border-l-8 border-l-[#BA3D3B]";
    }

    root.innerHTML = `
      <a href="${opts.url}" class="no-underline">
        <div class="${tooltipClass}">
          <div class="px-3 py-1">
            <h3 class="font-display text-base text-black font-bold mb-2 leading-tight">${opts.name}</h3>

            <div class="flex items-center text-xs text-black mb-1.5 font-semibold space-x-2">
              <img src="${organizationIcon}"/>
              <span>${opts.organization}</span>
            </div>

            <div class="flex items-center text-xs text-black mb-1.5 font-semibold space-x-2">
              <img src="${calendarIcon}"/>
              <span>${opts.datetime}</span>
            </div>

            <div class="flex items-start text-xs text-black mb-1.5 font-semibold space-x-2">
              <img src="${locationIcon}"/>
              <span>${opts.location}</span>
            </div>
          </div>
        </div>
      </a>
    `;

    return root;
  };

  const createPopUpForPointer = (opts: {
    name: string;
    url?: string;
    organization: string;
    datetime: string;
    location: string;
    attendLabel: string;
    eventType: EventType;
  }) => {
    const {
      name,
      url = "",
      organization,
      datetime,
      location,
      attendLabel,
      eventType,
    } = opts;
    return new maplibregl.Popup({
      offset: 25,
      maxWidth: "260px",
    }).setDOMContent(
      buildExpandedTooltip({
        name,
        url,
        organization, // TODO: pass in event's organization name
        datetime, // TODO: pass in event's date and time information
        location,
        attendLabel,
        eventType,
      })
    );
  };

  return {
    createPointerMarker,
    createMapForMarkerTypeMap,
  };
};
export default usePointerMap;
