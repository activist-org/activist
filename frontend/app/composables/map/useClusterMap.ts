// SPDX-License-Identifier: AGPL-3.0-or-later
import type MapLibreGlDirections from "@maplibre/maplibre-gl-directions";
import type { Feature, GeoJsonProperties, Point } from "geojson";

import { layersFactory } from "@maplibre/maplibre-gl-directions";
import {
  type Map,
  type GeoJSONSource,
  Marker,
  Popup,
  LngLatBounds,
} from "maplibre-gl";

const DECLUSTER_ZOOM = 8;
const CLUSTER_RADIUS = 40;
const CLUSTER_MAX_ZOOM = DECLUSTER_ZOOM - 1;
const CLUSTER_LAYERS = ["clusters", "cluster-count"] as const;

export const useClusterMap = () => {
  const { createPointerMarker } = usePointerMap();
  const {
    addDirectionsLayer,
    setSelectedRoute,
    resetDirectionsControl,
    setDirections,
    setMap,
    setMarker,
  } = useRouting();

  const createPopup = (content: PopupContent) =>
    new Popup({
      offset: 25,
      maxWidth: "16.25rem",
    }).setDOMContent(content);

  const buildPointerPayload = (
    id: string,
    coords: [number, number],
    color: string,
    name: string,
    popup: PopupContent
  ): Pointer => ({
    id,
    color,
    location: {
      id,
      lon: coords[0].toString(),
      lat: coords[1].toString(),
      bbox: ["0", "0", "0", "0"],
      addressOrName: name || "",
      countryCode: "",
      city: "",
    },
    popup: popup as HTMLElement,
  });

  const createDonutChart = (props: DonutProperties, clusterId: number) => {
    if (!props) {
      throw new Error("Cluster properties are missing.");
    }
    const offsets: number[] = [];
    const counts = props.map((item) => item.value as number);
    let total = 0;
    for (const count of counts) {
      offsets.push(total);
      total += count;
    }
    const r = 20;
    const r0 = Math.round(r * 0.6);
    const w = r * 2;

    // Note: This HTML can't be formatted.
    let html = `<div style="cursor: pointer"><svg width="${w}" height="${w}" viewbox="0 0 ${w} ${w}" text-anchor="middle" style="font: 0.75rem sans-serif; display: block">`;

    for (let i = 0; i < counts.length; i++) {
      html += donutSegment(
        (offsets[i] ?? 0) / total,
        ((offsets[i] ?? 0) + (counts[i] ?? 0)) / total,
        r,
        r0,
        props[i]?.color ?? "#000000"
      );
    }
    html += `<circle cx="${r}" cy="${r}" r="${r0}" fill="white"/><text dominant-baseline="central" transform="translate(${r}, ${r})">${total}</text></svg></div>`;

    const el = document.createElement("div");
    el.innerHTML = html;
    const firstChild = el.firstChild as HTMLElement;
    firstChild.id = `cluster-${clusterId}`;
    // Add proper ARIA role for accessibility compliance.
    firstChild.setAttribute("role", "button");
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

  const syncLayerVisibility = (map: Map, zoom: number) => {
    const showClusters = zoom < DECLUSTER_ZOOM;
    const clusterVisibility = showClusters ? "visible" : "none";
    const pointVisibility = showClusters ? "none" : "visible";

    for (const layerId of CLUSTER_LAYERS) {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, "visibility", clusterVisibility);
      }
    }
    if (map.getLayer("unclustered-points")) {
      map.setLayoutProperty(
        "unclustered-points",
        "visibility",
        pointVisibility
      );
    }
  };

  const reconcileMarkers = (
    map: Map,
    markersOnScreen: Record<string, Marker>,
    nextMarkers: Record<string, Marker>
  ): Record<string, Marker> => {
    for (const [id, marker] of Object.entries(markersOnScreen)) {
      if (!nextMarkers[id]) {
        marker.remove();
      }
    }
    for (const [id, marker] of Object.entries(nextMarkers)) {
      if (!markersOnScreen[id]) {
        marker.addTo(map);
      }
    }
    return nextMarkers;
  };

  const collectMarkers = async (
    map: Map,
    markersOnScreen: Record<string, Marker>,
    directions: MapLibreGlDirections,
    popupCreate: (props: GeoJsonProperties) => PopupContent,
    clusterProperties: ClusterProperties,
    pointerTooltipCreate: (props: GeoJsonProperties) => PopupContent,
    isStale: () => boolean
  ): Promise<Record<string, Marker>> => {
    const nextMarkers: Record<string, Marker> = {};
    const seenKeys = new Set<string>();
    const features = map.querySourceFeatures("pointers");
    const currentZoom = map.getZoom();
    const leafFetches: Array<{ id: number; pointCount: number }> = [];

    for (const feature of features) {
      const { geometry } = feature;
      if (geometry.type !== "Point") {
        continue;
      }

      const coords = geometry.coordinates as [number, number];
      const props = feature.properties ?? {};

      if (props.cluster) {
        const clusterId = Number(props.cluster_id);
        if (currentZoom >= DECLUSTER_ZOOM) {
          leafFetches.push({
            id: clusterId,
            pointCount: Number(props.point_count ?? 0),
          });
          continue;
        }

        const key = `cluster:${clusterId}`;
        if (seenKeys.has(key)) {
          continue;
        }
        seenKeys.add(key);

        if (markersOnScreen[key]) {
          nextMarkers[key] = markersOnScreen[key];
          continue;
        }

        const donutProps = clusterProperties?.getMultipleDonutProps(props);
        const el = createDonutChart(donutProps, clusterId);
        const marker = new Marker({ element: el })
          .setLngLat(coords)
          .setPopup(createPopup(popupCreate(props)));
        nextMarkers[key] = marker;
        setMarker(marker);
        continue;
      }

      if (currentZoom < DECLUSTER_ZOOM) {
        const key = `donut:${props.id}`;
        if (seenKeys.has(key)) {
          continue;
        }
        seenKeys.add(key);

        if (markersOnScreen[key]) {
          nextMarkers[key] = markersOnScreen[key];
          continue;
        }

        const donutProps = clusterProperties?.getIndividualDonutProps(props);
        const el = createDonutChart(donutProps, props.id);
        const marker = new Marker({ element: el })
          .setLngLat(coords)
          .setPopup(createPopup(popupCreate(props)));
        nextMarkers[key] = marker;
        continue;
      }

      const key = `pointer:${props.id}`;
      if (seenKeys.has(key)) {
        continue;
      }
      seenKeys.add(key);

      if (markersOnScreen[key]) {
        nextMarkers[key] = markersOnScreen[key];
        continue;
      }

      const color = clusterProperties?.getPointerColor(props);
      const popup = pointerTooltipCreate(props);
      const marker = createPointerMarker(
        buildPointerPayload(props.id, coords, color, props.name || "", popup),
        directions
      ).setLngLat(coords);
      nextMarkers[key] = marker;
      setMarker(marker);
    }

    if (leafFetches.length > 0) {
      const source = map.getSource("pointers") as GeoJSONSource | undefined;
      if (source && typeof source.getClusterLeaves === "function") {
        const leavesPerCluster = await Promise.all(
          leafFetches.map(({ id, pointCount }) =>
            source.getClusterLeaves(id, pointCount, 0)
          )
        );
        if (isStale()) {
          return nextMarkers;
        }
        for (const leaves of leavesPerCluster) {
          for (const leaf of leaves ?? []) {
            const leafProps = leaf.properties ?? {};
            const markerId = leafProps.id;
            const key = `pointer:${markerId}`;
            if (seenKeys.has(key)) {
              continue;
            }
            seenKeys.add(key);

            if (markersOnScreen[key]) {
              nextMarkers[key] = markersOnScreen[key];
              continue;
            }

            const leafCoords = (leaf.geometry as Point).coordinates as [
              number,
              number,
            ];
            const popup = pointerTooltipCreate(leafProps);
            const marker = createPointerMarker(
              buildPointerPayload(
                markerId,
                leafCoords,
                leafProps.color,
                leafProps.name || "",
                popup
              ),
              directions
            ).setLngLat(leafCoords);
            nextMarkers[key] = marker;
            setMarker(marker);
          }
        }
      }
    }

    return nextMarkers;
  };

  const createMapForClusterTypeMap = (
    map: Map,
    pointers: PointerCluster[],
    isTouchDevice: boolean,
    clusterProperties: ClusterProperties,
    clusterTooltipCreate: (value: unknown) => PopupContent,
    pointerTooltipCreate: (value: unknown) => PopupContent
  ) => {
    const selectedRoute = setSelectedRoute();
    let markersOnScreen: Record<string, Marker> = {};
    let latestUpdateId = 0;
    let isDisposed = false;

    const cleanupMarkers = () => {
      isDisposed = true;
      latestUpdateId += 1;
      for (const marker of Object.values(markersOnScreen)) {
        marker.remove();
      }
      markersOnScreen = {};
    };

    map.on("remove", cleanupMarkers);

    map.on("load", () => {
      // Cleanup existing sources/layers.
      for (const layerId of [
        "clusters",
        "cluster-count",
        "unclustered-points",
      ]) {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
      }
      if (map.getSource("pointers")) {
        map.removeSource("pointers");
      }
      map.on("click", () => {
        resetDirectionsControl();
      });

      // MARK: Process Events
      const features: Feature<Point, GeoJsonProperties>[] = pointers.map(
        (pointer) => ({
          type: "Feature",
          properties: pointer.properties || {},
          geometry: {
            type: "Point",
            coordinates: [
              parseFloat(pointer?.location?.lon || "0"),
              parseFloat(pointer?.location?.lat || "0"),
            ],
          },
        })
      );
      const logic: { [key: string]: unknown } = {};

      // Add a clustered GeoJSON source for events.
      Object.keys(clusterProperties.cluster).forEach(
        (key) => (logic[key] = clusterProperties.cluster[key]?.logic)
      );
      map.addSource("pointers", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features,
        },
        cluster: true,
        clusterRadius: CLUSTER_RADIUS,
        clusterMaxZoom: CLUSTER_MAX_ZOOM,
        clusterProperties: logic,
      });

      // Add a layer for unclustered points.
      map.addLayer({
        id: "unclustered-points",
        source: "pointers",
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
        source: "pointers",
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

      // Add a layer for cluster labels.
      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "pointers",
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
      resetDirectionsControl();

      if (features.length > 0) {
        const bounds = features.reduce(
          (acc, feature) =>
            acc.extend(feature.geometry.coordinates as [number, number]),
          new LngLatBounds()
        );
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

      let wasClustered = map.getZoom() < DECLUSTER_ZOOM;

      const refreshMarkers = async () => {
        if (isDisposed) {
          return;
        }
        const updateId = ++latestUpdateId;
        syncLayerVisibility(map, map.getZoom());

        const nextMarkers = await collectMarkers(
          map,
          markersOnScreen,
          directions,
          clusterTooltipCreate,
          clusterProperties,
          pointerTooltipCreate,
          () => isDisposed || updateId !== latestUpdateId
        );

        // Discard stale async completions if a newer update or unmount occurred.
        if (isDisposed || updateId !== latestUpdateId) {
          return;
        }

        markersOnScreen = reconcileMarkers(map, markersOnScreen, nextMarkers);
      };

      // Sync initial visibility and markers immediately after initial bounds/jump.
      void refreshMarkers();

      // Transition markers immediately when crossing DECLUSTER_ZOOM during zoom.
      map.on("zoom", () => {
        const isClustered = map.getZoom() < DECLUSTER_ZOOM;
        if (isClustered !== wasClustered) {
          wasClustered = isClustered;
          void refreshMarkers();
        }
      });

      map.on("zoomend", () => {
        wasClustered = map.getZoom() < DECLUSTER_ZOOM;
        void refreshMarkers();
      });

      map.on("moveend", () => {
        void refreshMarkers();
      });

      map.once("idle", () => {
        void refreshMarkers();
      });
    });
  };

  return {
    donutSegment,
    createDonutChart,
    createMapForClusterTypeMap,
  };
};
