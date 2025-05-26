// SPDX-License-Identifier: AGPL-3.0-or-later

import type MapLibreGlDirections from "@maplibre/maplibre-gl-directions";

import { layersFactory } from "@maplibre/maplibre-gl-directions";
import maplibregl from "maplibre-gl";

import type { Location } from "~/types/content/location";
import type { EventType } from "~/types/events/event";

import { colorByType, type RouteProfile } from "~/types/map";

import { useRouting } from "./useRoutingMap";

const organizationIcon = `/icons/map/tooltip_organization.png`;
const calendarIcon = `/icons/map/tooltip_datetime.png`;
const locationIcon = `/icons/map/tooltip_location.png`;
export const usePointerMap = () => {
  const {
    addDirectionsLayer,
    setSelectedRoute,
    resetDirectionsControl,
    setDirections,
    setMap,
    setMarker,
  } = useRouting();
  const createPointerMarker = (
    color: string,
    latitude: { lon: string; lat: string },
    attendLabel: string,
    event: {
      type: EventType;
      location: string;
      name: string;
      id: string;
    },
    directions: MapLibreGlDirections | undefined = undefined
  ) => {
    const marker = new maplibregl.Marker({
      color,
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
    if (directions) {
      directions.interactive = true;
      marker.getElement().addEventListener("mouseenter", () => {
        directions.interactive = false;
      });

      marker.getElement().addEventListener("mouseleave", () => {
        directions.interactive = true;
      });
    }
    return marker;
  };

  const createMapForPointerTypeMap = (
    map: maplibregl.Map,
    event: { name: string; location: Location; type: EventType; id: string },
    isTouchDevice: boolean,
    attendLabel: string
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

    const selectedRoute = setSelectedRoute();
    map.on("load", () => {
      const layers = layersFactory(
        isTouchDevice ? 1.5 : 1,
        isTouchDevice ? 2 : 1
      );
      // Add arrow to directions layer.
      const directions = addDirectionsLayer(
        map,
        layers,
        selectedRoute as RouteProfile
      );
      setDirections(directions);
      const marker = createPointerMarker(
        colorByType[event.type || "learn"],
        event.location,
        attendLabel,
        {
          type: event.type,
          location: event.location.displayName,
          name: event.name,
          id: event.id,
        },
        directions
      ).addTo(map);
      setMap(map);
      setMarker(marker);
      map.on("click", () => {
        resetDirectionsControl();
      });
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
    createMapForPointerTypeMap,
  };
};
export default usePointerMap;
