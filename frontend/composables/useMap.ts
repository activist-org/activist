// SPDX-License-Identifier: AGPL-3.0-or-later

import type { Feature, Point, GeoJsonProperties } from "geojson";

import MapLibreGlDirections, {
  layersFactory,
} from "@maplibre/maplibre-gl-directions";
import maplibregl, { type LayerSpecification } from "maplibre-gl";

import type { Location } from "~/types/content/location";
import type { EventType, Event } from "~/types/events/event";

import { type RouteProfile, ColorByEventType } from "~/types/map";

const organizationIcon = `/icons/map/tooltip_organization.png`;
const calendarIcon = `/icons/map/tooltip_datetime.png`;
const locationIcon = `/icons/map/tooltip_location.png`;
export const useMap = () => {
  const i18n = useI18n();
  const colorByType = {
    learn: ColorByEventType.LEARN,
    action: ColorByEventType.ACTION,
  };
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
      center: [0, 20], // Default center
      zoom: 1.5, // Shows entire world
      minZoom: 1,
      maxZoom: 18,
      renderWorldCopies: false,
      cooperativeGestures: true,
    });
    // Remove automatic resize handler
    map.on("load", () => {
      map.resize();
    });

    return map;
  };

  const createMarker = (
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

  const createDonutChart = (props: GeoJsonProperties) => {
    if (!props) throw new Error("Cluster properties are missing.");
    const offsets = [];
    const counts = [props.learn || 0, props.action || 0];
    let total = 0;
    for (let i = 0; i < counts.length; i++) {
      offsets.push(total);
      total += counts[i];
    }
    const r = 20;
    const r0 = Math.round(r * 0.6);
    const w = r * 2;

    let html = `<div><svg width="${w}" height="${w}" viewbox="0 0 ${w} ${w}" text-anchor="middle" style="font: 12px sans-serif; display: block">`;

    for (let i = 0; i < counts.length; i++) {
      html += donutSegment(
        offsets[i] / total,
        (offsets[i] + counts[i]) / total,
        r,
        r0,
        i === 0 ? "#51bbd6" : "#f28cb1"
      );
    }
    html += `<circle cx="${r}" cy="${r}" r="${r0}" fill="white" /><text dominant-baseline="central" transform="translate(${r}, ${r})">${total}</text></svg></div>`;

    const el = document.createElement("div");
    el.innerHTML = html;
    return el.firstChild as HTMLElement;
  };

  const donutSegment = (
    start: number,
    end: number,
    r: number,
    r0: number,
    color: string
  ) => {
    if (end - start === 1) end -= 0.00001;
    const a0 = 2 * Math.PI * (start - 0.25);
    const a1 = 2 * Math.PI * (end - 0.25);
    const x0 = Math.cos(a0),
      y0 = Math.sin(a0);
    const x1 = Math.cos(a1),
      y1 = Math.sin(a1);
    const largeArc = end - start > 0.5 ? 1 : 0;

    return [
      '<path d="M',
      r + r0 * x0,
      r + r0 * y0,
      "L",
      r + r * x0,
      r + r * y0,
      "A",
      r,
      r,
      0,
      largeArc,
      1,
      r + r * x1,
      r + r * y1,
      "L",
      r + r0 * x1,
      r + r0 * y1,
      "A",
      r0,
      r0,
      0,
      largeArc,
      0,
      r + r0 * x0,
      r + r0 * y0,
      `" fill="${color}" />`,
    ].join(" ");
  };

  const updateMarkers = (
    map: maplibregl.Map,
    markers: { [key: string]: maplibregl.Marker },
    markersOnScreen: { [key: string]: maplibregl.Marker } = {}
  ) => {
    const newMarkers: { [key: string]: maplibregl.Marker } = {};
    const features = map.querySourceFeatures("events");

    // Add this at the top of your updateMarkers function
    const currentZoom = map.getZoom();
    const DECLUSTER_ZOOM = 8;
    console.log("Current zoom level:", currentZoom);
    for (let i = 0; i < features.length; i++) {
      const geometry = features[i].geometry;
      if (geometry.type === "Point") {
        const coords = geometry.coordinates as [number, number];
        const props = features[i].properties;

        if (props.cluster) {
          // Cluster handling with zoom-based declustering
          const id = props.cluster_id;

          if (currentZoom >= DECLUSTER_ZOOM) {
            // Show individual markers for clusters at high zoom
            const source = map.getSource("events") as maplibregl.GeoJSONSource;

            source.getClusterLeaves(id, props.point_count, 0).then((leaves) => {
              console.log(leaves);
              leaves?.forEach((leaf) => {
                const leafProps = leaf.properties!;
                const color = colorByType[leafProps.type as EventType];
                const markerId = leafProps.id;

                if (!markersOnScreen[markerId]) {
                  const marker = createMarker(color, {
                    lon: coords[0].toString(),
                    lat: coords[1].toString(),
                  }).setLngLat(coords);

                  markers[markerId] = marker;
                  marker.addTo(map);
                  newMarkers[markerId] = marker;
                }
              });
            });
          } else {
            // Show cluster markers at low zoom
            let marker = markers[id];
            if (!marker) {
              const el = createDonutChart(props);
              marker = markers[id] = new maplibregl.Marker({
                element: el,
              }).setLngLat(coords);
            }
            newMarkers[id] = marker;
            if (!markersOnScreen[id]) marker.addTo(map);
          }
        } else {
          // Individual point handling
          const color = colorByType[props.type as EventType];
          const marker = createMarker(color, {
            lon: coords[0].toString(),
            lat: coords[1].toString(),
          }).setLngLat(coords);

          newMarkers[props.id] = marker;
          if (!markersOnScreen[props.id]) marker.addTo(map);
        }
      }
    }

    for (const id in markersOnScreen) {
      if (!newMarkers[id]) markersOnScreen[id].remove();
    }
    markersOnScreen = newMarkers;
    return {
      markersOnScreen,
    };
  };

  const createMapForClusterTypeMap = (map: maplibregl.Map, events: Event[]) => {
    map.on("load", () => {
      // Cleanup existing sources/layers
      if (map.getSource("events")) map.removeSource("events");
      ["clusters", "cluster-count", "unclustered-points"].forEach((layerId) => {
        if (map.getLayer(layerId)) map.removeLayer(layerId);
      });

      // Process events
      const features: Feature<Point, GeoJsonProperties>[] = events.map(
        (event) => ({
          type: "Feature",
          properties: {
            id: event.id,
            name: event.name,
            type: event.type,
          },
          geometry: {
            type: "Point",
            coordinates: [
              parseFloat(event?.offlineLocation?.lon || "0"),
              parseFloat(event?.offlineLocation?.lat || "0"),
            ],
          },
        })
      );
      // Add a clustered GeoJSON source for events
      map.addSource("events", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features,
        },
        cluster: true,
        clusterRadius: 80, // Adjust cluster density by zoom
        clusterMaxZoom: 14, // Max zoom where clustering occurs
        clusterProperties: {
          // Example: Count events by type
          learn: ["+", ["case", ["==", ["get", "type"], "learn"], 1, 0]],
          action: ["+", ["case", ["==", ["get", "type"], "action"], 1, 0]],
        },
      });

      // Add a layer for unclustered points
      map.addLayer({
        id: "unclustered-points",
        source: "events",
        type: "symbol",
        filter: [
          "any",
          ["!", ["has", "point_count"]], // Individual points
          ["==", ["get", "point_count"], 1], // Single-event clusters
        ],
        paint: {
          "icon-opacity": 1,
        },
      });

      // Add a layer for clusters
      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "events",
        filter: [
          "all",
          ["==", "cluster", true],
          [">", "point_count", 1],
          ["<", ["zoom"], 13],
        ], // <-- Here
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            100,
            "#f1f075",
            750,
            "#f28cb1",
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            100,
            30,
            750,
            40,
          ],
        },
      });

      // Add a layer for cluster labels
      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "events",
        filter: [
          "all",
          ["==", "cluster", true],
          [">", "point_count", 1],
          [">=", ["zoom"], 12],
        ], // <-- Here
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });
      if (features.length > 0) {
        const bounds = features.reduce(
          (acc, feature) =>
            acc.extend(feature.geometry.coordinates as [number, number]),
          new maplibregl.LngLatBounds()
        );
        // Add stable bounds check
        if (bounds.isEmpty()) return;

        map.fitBounds(bounds, {
          padding: 50,
          maxZoom: 3, // Reduced from 12 to maintain wider view
          duration: 0, // Instant transition
        });
      } else {
        // Explicitly set world view when no events
        map.jumpTo({
          center: [0, 20],
          zoom: 1.5,
        });
      }

      map.on("sourcedata", (e) => {
        // Optional: Add custom HTML markers for clusters
        const markers: { [key: string]: maplibregl.Marker } = {};
        let markersOnScreen: { [key: string]: maplibregl.Marker } = {};
        if (e.sourceId !== "events" || !e.isSourceLoaded) return;

        map.on("zoomend", () => {
          const currentZoom = map.getZoom();

          // Adjust cluster visibility
          map.setFilter("clusters", [
            "all",
            ["==", "cluster", true],
            [">", "point_count", 1],
            ["<", currentZoom, 13],
          ]);

          // Adjust individual points visibility
          map.setFilter("unclustered-points", [
            "all",
            ["!=", "cluster", true],
            [">=", currentZoom, 12],
          ]);

          // Force re-render of markers
          const { markersOnScreen: newMarkersOnScreen } = updateMarkers(
            map,
            markers,
            markersOnScreen
          );
          markersOnScreen = newMarkersOnScreen;
        });

        map.on("move", () => {
          const { markersOnScreen: newMarkersOnScreen } = updateMarkers(
            map,
            markers,
            markersOnScreen
          );
          markersOnScreen = newMarkersOnScreen;
        });
        map.on("moveend", () => {
          const { markersOnScreen: newMarkersOnScreen } = updateMarkers(
            map,
            markers,
            markersOnScreen
          );
          markersOnScreen = newMarkersOnScreen;
        });
        updateMarkers(map, markers, markersOnScreen);
      });
    });
  };

  const createMapForMarkerTypeMap = (
    map: maplibregl.Map,
    event: { name: string; location: Location; type: EventType },
    attendLabel: string,
    isTouchDevice: boolean,
    selectedRoute: RouteProfile | undefined,
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

    // Add localized tooltips for NavigationControl buttons
    const zoomInButton: HTMLElement | null = map
      .getContainer()
      .querySelector(".maplibregl-ctrl-zoom-in");
    if (zoomInButton)
      zoomInButton.title = i18n.t("i18n.composables.use_map.zoom_in");

    const zoomOutButton: HTMLElement | null = map
      .getContainer()
      .querySelector(".maplibregl-ctrl-zoom-out");
    if (zoomOutButton)
      zoomOutButton.title = i18n.t("i18n.composables.use_map.zoom_out");

    const compassButton: HTMLElement | null = map
      .getContainer()
      .querySelector(".maplibregl-ctrl-compass");
    if (compassButton)
      compassButton.title = i18n.t("i18n.composables.use_map.reset_north");

    // Localize GeolocateControl
    const geoLocateControl = createGeoLocateControl();
    map.addControl(geoLocateControl);

    const geolocateButton: HTMLElement | null = map
      .getContainer()
      .querySelector(".maplibregl-ctrl-geolocate");
    if (geolocateButton)
      geolocateButton.title = i18n.t("i18n.composables.use_map.geolocate");

    const popup = createPopUp({
      name: event.name,
      url: ``, // TODO: Pass in event webpage URL
      organization: "Organization", // TODO: Pass in event's organization name
      datetime: "Date & Time", // TODO: Pass in event's date and time information
      location: event.location.displayName.split(",").slice(0, 3).join(", "),
      attendLabel,
      eventType: event.type,
    });

    // Arrow icon for directions.
    map
      .loadImage("/icons/from_library/bootstrap_arrow_right.png")
      .then((image) => {
        if (image) {
          map.addImage("route-direction-arrow", image.data);
        }
      });

    const marker = createMarker(
      colorByType[event?.type || ("learn" as EventType)],
      event.location,
      popup
    ).addTo(map);

    map.on("load", () => {
      const layers = layersFactory(
        isTouchDevice ? 1.5 : 1,
        isTouchDevice ? 2 : 1
      );

      // MARK: Directions Layer

      // Add arrow to directions layer.
      addDirectionsLayer(map, layers, selectedRoute as RouteProfile, marker);

      if (fn) fn();
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

  const createFullScreenControl = () => {
    return new maplibregl.FullscreenControl();
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

  const createPopUp = (opts: {
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
        organization, // TODO: Pass in event's organization name
        datetime, // TODO: Pass in event's date and time information
        location,
        attendLabel,
        eventType,
      })
    );
  };

  return {
    buildExpandedTooltip,
    isWebglSupported,
    createMap,
    createMarker,
    createFullScreenControl,
    createNavigationControl,
    createGeoLocateControl,
    createPopUp,
    addDirectionsLayer,
    createMapForMarkerTypeMap,
    createMapForClusterTypeMap,
  };
};
