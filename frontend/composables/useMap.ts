import maplibregl, { type LayerSpecification } from "maplibre-gl";

import type { EventType } from "~/types/events/event";
const organizationIcon = `/icons/map/tooltip_organization.png`;
const calendarIcon = `/icons/map/tooltip_datetime.png`;
const locationIcon = `/icons/map/tooltip_location.png`;

export const useMap = () => {
  function buildExpandedTooltip(opts: {
    name: string;
    url: string;
    organization: string;
    datetime: string;
    location: string;
    attendLabel: string;
    eventType: EventType;
  }) {
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
  }

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
        console.log(e);
      }
      return false;
    }
    // WebGL not supported.
    return false;
  }

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
      pitch: 20,
      maxZoom: 20,
    });
    return map;
  }

  const createMarker = (color:string,  latitude:{lon:string, lat:string}, popup?:maplibregl.Popup) => {
    const marker = new maplibregl.Marker({
      color
    });

    marker.addClassName("cursor-pointer");
    marker
        .setLngLat([
          parseFloat(latitude.lon),
          parseFloat(latitude.lat),
        ])
        .setPopup(popup)
        return marker;
  }

  const createClusteringToMap = () => {}

  const createFullScreenControl = () => {
    return new maplibregl.FullscreenControl();
  }

  const createNavigationControl = () => {
    return new maplibregl.NavigationControl({
      visualizePitch: true,
    });
  }

  const createGeoLocateControl = () => {
    return new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });
  }

  const createPopUp = (opts: { name:string, url?:string, organization:string, datetime: string, location: string, attendLabel: string, eventType:EventType }) => {
    const { name, url = '', organization, datetime, location, attendLabel, eventType } = opts;
    return new maplibregl.Popup({
      offset: 25,
      maxWidth: "260px",
    }).setDOMContent(
      buildExpandedTooltip({
        name,
        url,
        organization, // TODO: Pass in event's organization name
        datetime, // TODO: Pass in event's date and time information
        location,
        attendLabel,
        eventType,
      })
    )
  }


return {
    buildExpandedTooltip,
    isWebglSupported,
    createMap,
    createMarker,
    createFullScreenControl,
    createNavigationControl,
    createGeoLocateControl,
    createPopUp,
  };
}
