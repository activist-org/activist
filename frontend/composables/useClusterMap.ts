// SPDX-License-Identifier: AGPL-3.0-or-later

import type MapLibreGlDirections from "@maplibre/maplibre-gl-directions";
import type { Feature, GeoJsonProperties, Point } from "geojson";

import { layersFactory } from "@maplibre/maplibre-gl-directions";
import maplibregl from "maplibre-gl";

import type { Event, EventType } from "~/types/events/event";

import { colorByType, type RouteProfile } from "~/types/map";

import usePointerMap from "./usePointerMap";
import { useRouting } from "./useRoutingMap";

export const useClusterMap = () => {
  const i18n = useI18n();
  const { createPointerMarker } = usePointerMap();
  const {
    addDirectionsLayer,
    setSelectedRoute,
    resetDirectionsControl,
    setDirections,
    setMap,
    setMarker,
  } = useRouting();
  const DECLUSTER_ZOOM = 8;
  const createDonutChart = (props: GeoJsonProperties) => {
    if (!props) {
      throw new Error("Cluster properties are missing.");
    }
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

    // Note: This HTML can't be formatted.
    let html = `<div style="cursor: pointer"><svg width="${w}" height="${w}" viewbox="0 0 ${w} ${w}" text-anchor="middle" style="font: 12px sans-serif; display: block">`;

    for (let i = 0; i < counts.length; i++) {
      html += donutSegment(
        offsets[i] / total,
        (offsets[i] + counts[i]) / total,
        r,
        r0,
        i === 0 ? colorByType["learn"] : colorByType["action"]
      );
    }
    html += `<circle cx="${r}" cy="${r}" r="${r0}" fill="white"/><text dominant-baseline="central" transform="translate(${r}, ${r})">${total}</text></svg></div>`;

    const el = document.createElement("div");
    el.innerHTML = html;
    const firstChild = el.firstChild as HTMLElement;
    firstChild.id = `cluster-${props.id}`;
    return firstChild;
  };

  const donutSegment = (
    start: number,
    end: number,
    r: number,
    r0: number,
    color: string
  ) => {
    if (end - start === 1) {
      end -= 0.00001;
    }
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

  const createPopUpForCluster = (opts: {
    learnAmount: number;
    actionAmount: number;
  }) => {
    return new maplibregl.Popup({
      offset: 25,
      maxWidth: "260px",
    }).setDOMContent(buildExpandedTooltip(opts));
  };

  const buildExpandedTooltip = (opts: {
    learnAmount: number;
    actionAmount: number;
  }) => {
    const root = document.createElement("div");
    root.className = "w-[220px] cursor-pointer font-sans";

    let tooltipClass =
      "overflow-hidden bg-white rounded-sm border-l-8 border-l";

    if (opts.learnAmount === 0) {
      tooltipClass += "-[#BA3D3B]";
    } else if (opts.actionAmount === 0) {
      tooltipClass += "-[#2176AE]";
    }

    const eventsInThisArea = i18n.t(
      "i18n.composables.use_cluster_map.events_in_this_area"
    );
    let clusterTooltipHTML = `
      <div class="${tooltipClass}">
        <div class="px-3 pt-1">
          <h3 class="font-display text-base text-black font-bold mb-2 leading-tight">${eventsInThisArea}:</h3>
    `;

    const learnEvents = i18n.t("i18n.composables.use_cluster_map.learn_events");
    if (opts.learnAmount > 0) {
      clusterTooltipHTML += `
        <div class="flex items-center text-xs text-black mb-1.5 font-semibold space-x-2">
          <span>${learnEvents}: ${opts.learnAmount}</span>
        </div>
      `;
    }

    const actionEvents = i18n.t(
      "i18n.composables.use_cluster_map.action_events"
    );
    if (opts.actionAmount > 0) {
      clusterTooltipHTML += `
        <div class="flex items-center text-xs text-black mb-1.5 font-semibold space-x-2">
          <span>${actionEvents}: ${opts.actionAmount}</span>
        </div>
      `;
    }

    clusterTooltipHTML += `
        </div>
      </div>
    `;

    root.innerHTML = clusterTooltipHTML;

    return root;
  };

  // TODO: REFACTOR THIS FUNCTION TO MAKE IT MORE READABLE
  const updateMarkers = (
    map: maplibregl.Map,
    markers: { [key: string]: maplibregl.Marker },
    markersOnScreen: { [key: string]: maplibregl.Marker } = {},
    directions: MapLibreGlDirections
  ) => {
    const newMarkers: { [key: string]: maplibregl.Marker } = {};
    const features = map.querySourceFeatures("events");

    // Add this at the top of your updateMarkers function.
    const currentZoom = map.getZoom();

    for (let i = 0; i < features.length; i++) {
      const { geometry } = features[i];
      if (geometry.type === "Point") {
        const coords = geometry.coordinates as [number, number];
        const props = features[i].properties;

        if (props.cluster) {
          // Cluster handling with zoom-based declustering.
          const id = props.cluster_id;
          if (currentZoom >= DECLUSTER_ZOOM) {
            // Show individual markers for clusters at high zoom.
            const source = map.getSource("events") as maplibregl.GeoJSONSource;

            source.getClusterLeaves(id, props.point_count, 0).then((leaves) => {
              leaves?.forEach((leaf) => {
                const leafProps = leaf.properties!;
                const color = colorByType[leafProps.type as EventType];
                const markerId = leafProps.id;
                const coords = (leaf.geometry as Point).coordinates;
                const leafCoords = coords as [number, number];
                if (!markersOnScreen[markerId]) {
                  const marker = createPointerMarker(
                    color,
                    {
                      lon: leafCoords[0].toString(),
                      lat: leafCoords[1].toString(),
                    },
                    "",
                    {
                      type: leafProps.type,
                      location: leafProps.location,
                      name: leafProps.name,
                      id,
                    },
                    directions
                  ).setLngLat(leafCoords);

                  markers[markerId] = marker;
                  marker.addTo(map);
                  newMarkers[markerId] = marker;
                }
              });
            });
          } else {
            // Show cluster markers at low zoom.
            const element = document.getElementById(`pointer-${id}`);
            element?.remove();
            let marker = markers[id];
            if (!marker) {
              const el = createDonutChart(props);
              const popUp = createPopUpForCluster({
                learnAmount: props.learn || 0,
                actionAmount: props.action || 0,
              });
              marker = markers[id] = new maplibregl.Marker({
                element: el,
              })
                .setLngLat(coords)
                .setPopup(popUp);
            }
            newMarkers[id] = marker;
            if (!markersOnScreen[id]) {
              marker.addTo(map);
              setMarker(marker);
              resetDirectionsControl();
            }
          }
        } else {
          // Individual point handling.
          if (currentZoom < DECLUSTER_ZOOM) {
            const element = document.getElementById(`pointer-${props.id}`);
            element?.remove();
            if (!markersOnScreen[props.id]) {
              const el = createDonutChart({
                ...props,
                learn: props.type === "learn",
                action: props.type === "action",
              });
              const popUp = createPopUpForCluster({
                learnAmount: +(props.type === "learn"),
                actionAmount: +(props.type === "action"),
              });
              const marker = new maplibregl.Marker({
                element: el,
              })
                .setLngLat(coords)
                .setLngLat(coords)
                .setPopup(popUp);

              newMarkers[props.id] = marker;
              if (!markersOnScreen[props.id]) {
                marker.addTo(map);
              }
            }
          } else {
            const element = document.getElementById(`cluster-${props.id}`);
            element?.remove();
            const color = colorByType[props.type as EventType];
            const marker = createPointerMarker(
              color,
              {
                lon: coords[0].toString(),
                lat: coords[1].toString(),
              },
              "",
              {
                type: props.type,
                location: props.location,
                name: props.name,
                id: props.id,
              },
              directions
            ).setLngLat(coords);
            newMarkers[props.id] = marker;
            if (!markersOnScreen[props.id]) {
              marker.addTo(map);
              setMarker(marker);
              resetDirectionsControl();
            }
          }
        }
      }
    }

    for (const id in markersOnScreen) {
      if (!newMarkers[id]) {
        markersOnScreen[id].remove();
      }
    }
    markersOnScreen = newMarkers;
    return {
      markersOnScreen,
    };
  };

  const createMapForClusterTypeMap = (
    map: maplibregl.Map,
    events: Event[],
    isTouchDevice: boolean
  ) => {
    const selectedRoute = setSelectedRoute();
    map.on("load", () => {
      // Cleanup existing sources/layers.
      if (map.getSource("events")) {
        map.removeSource("events");
      }
      ["clusters", "cluster-count", "unclustered-points"].forEach((layerId) => {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
      });

      // MARK: Process Events

      const features: Feature<Point, GeoJsonProperties>[] = events.map(
        (event) => ({
          type: "Feature",
          properties: {
            id: event.id,
            name: event.name,
            type: event.type,
            location: event.offlineLocation
              ? event.offlineLocation.displayName
              : "",
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
      // Add a clustered GeoJSON source for events.
      map.addSource("events", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features,
        },
        cluster: true,
        clusterRadius: 80, // adjust cluster density by zoom
        clusterMaxZoom: 14, // max zoom where clustering occurs
        clusterProperties: {
          // Example: Count events by type.
          learn: ["+", ["case", ["==", ["get", "type"], "learn"], 1, 0]],
          action: ["+", ["case", ["==", ["get", "type"], "action"], 1, 0]],
        },
      });

      // Add a layer for unclustered points.
      map.addLayer({
        id: "unclustered-points",
        source: "events",
        type: "symbol",
        filter: ["==", "id", ""], // Never matches anything.
        paint: {
          "icon-opacity": 1,
        },
      });

      // Add a layer for clusters.
      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "events",
        filter: ["all", ["==", "cluster", true], [">=", "point_count", "1"]],
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
        filter: ["all", ["==", "cluster", true], [">=", "point_count", "1"]],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["Open Sans Semibold"],
          "text-size": 12,
        },
      });

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
      setMap(map);
      setDirections(directions);
      if (features.length > 0) {
        const bounds = features.reduce(
          (acc, feature) =>
            acc.extend(feature.geometry.coordinates as [number, number]),
          new maplibregl.LngLatBounds()
        );
        // Add stable bounds check.
        if (bounds.isEmpty()) {
          return;
        }

        map.fitBounds(bounds, {
          padding: 50,
          maxZoom: 3, // reduced from 12 to maintain wider view
          duration: 0, // instant transition
        });
      } else {
        // Explicitly set world view when no events.
        map.jumpTo({
          center: [0, 20],
          zoom: 1.5,
        });
      }

      map.on("sourcedata", (e) => {
        // Optional: Add custom HTML markers for clusters.
        const markers: { [key: string]: maplibregl.Marker } = {};
        let markersOnScreen: { [key: string]: maplibregl.Marker } = {};
        if (e.sourceId !== "events" || !e.isSourceLoaded) {
          return;
        }

        map.on("zoomed", () => {
          const currentZoom = map.getZoom();

          if (currentZoom < DECLUSTER_ZOOM) {
            map.setLayoutProperty("clusters", "visibility", "visible");
            map.setLayoutProperty("unclustered-points", "visibility", "none");
          } else {
            map.setLayoutProperty("clusters", "visibility", "none");
            map.setLayoutProperty(
              "unclustered-points",
              "visibility",
              "visible"
            );
          }

          // Force re-render of markers.
          const { markersOnScreen: newMarkersOnScreen } = updateMarkers(
            map,
            markers,
            markersOnScreen,
            directions
          );
          markersOnScreen = newMarkersOnScreen;
        });

        map.on("move", () => {
          const { markersOnScreen: newMarkersOnScreen } = updateMarkers(
            map,
            markers,
            markersOnScreen,
            directions
          );
          markersOnScreen = newMarkersOnScreen;
        });

        map.on("moveend", () => {
          const { markersOnScreen: newMarkersOnScreen } = updateMarkers(
            map,
            markers,
            markersOnScreen,
            directions
          );
          markersOnScreen = newMarkersOnScreen;
        });
        const { markersOnScreen: newMarkersOnScreen } = updateMarkers(
          map,
          markers,
          markersOnScreen,
          directions
        );
        markersOnScreen = newMarkersOnScreen;
      });
    });
  };
  return {
    donutSegment,
    createDonutChart,
    createMapForClusterTypeMap,
  };
};
