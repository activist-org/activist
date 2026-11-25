// SPDX-License-Identifier: AGPL-3.0-or-later
import type { GeoJSONSource, Map } from "maplibre-gl";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useClusterMap, useRouting } from "../../../app/composables";

const {
  createdMarkers,
  MockMarker,
  MockPopup,
  MockLngLatBounds,
  mockLayersFactory,
  MockDirections,
} = vi.hoisted(() => {
  const createdMarkers: Array<{
    id?: string;
    addTo: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
    setLngLat: ReturnType<typeof vi.fn>;
    setPopup: ReturnType<typeof vi.fn>;
    addClassName: ReturnType<typeof vi.fn>;
    getElement: ReturnType<typeof vi.fn>;
  }> = [];

  const MockMarker = vi.fn().mockImplementation(function (
    this: Record<string, unknown>,
    options?: { element?: HTMLElement }
  ) {
    const el = options?.element ?? document.createElement("div");
    const marker = {
      id: el.id,
      addTo: vi.fn().mockReturnThis(),
      remove: vi.fn(),
      setLngLat: vi.fn().mockReturnThis(),
      setPopup: vi.fn().mockReturnThis(),
      addClassName: vi.fn().mockReturnThis(),
      getElement: vi.fn(() => el),
    };
    Object.assign(this, marker);
    createdMarkers.push(marker);
    return marker;
  });

  const MockPopup = vi.fn().mockImplementation(function (
    this: Record<string, unknown>
  ) {
    this.setDOMContent = vi.fn().mockReturnThis();
  });

  const MockLngLatBounds = vi.fn().mockImplementation(function (
    this: Record<string, unknown>
  ) {
    this.extend = vi.fn().mockReturnThis();
    this.isEmpty = vi.fn(() => false);
  });

  const mockLayersFactory = vi.fn(() => [{ id: "directions-base" }]);

  const MockDirections = vi.fn().mockImplementation(function (
    this: Record<string, unknown>
  ) {
    this.waypoints = [];
    this.interactive = true;
    this.clear = vi.fn();
    this.destroy = vi.fn();
  });

  return {
    createdMarkers,
    MockMarker,
    MockPopup,
    MockLngLatBounds,
    mockLayersFactory,
    MockDirections,
  };
});

vi.mock("maplibre-gl", () => ({
  Marker: MockMarker,
  Popup: MockPopup,
  LngLatBounds: MockLngLatBounds,
}));

vi.mock("@maplibre/maplibre-gl-directions", () => ({
  default: MockDirections,
  layersFactory: mockLayersFactory,
}));

vi.stubGlobal("useI18n", () => ({
  t: vi.fn((key: string) => key),
}));

function createMockMap(initialZoom = 3) {
  let zoom = initialZoom;
  const listeners: Record<string, Array<() => void>> = {};
  const onceListeners: Record<string, Array<() => void>> = {};
  const layers = new Set<string>();
  let source: Partial<GeoJSONSource> | undefined;

  const map = {
    on: vi.fn((event: string, cb: () => void) => {
      listeners[event] ??= [];
      listeners[event].push(cb);
    }),
    once: vi.fn((event: string, cb: () => void) => {
      onceListeners[event] ??= [];
      onceListeners[event].push(cb);
    }),
    emit: (event: string) => {
      for (const cb of listeners[event] ?? []) {
        cb();
      }
      const pendingOnce = onceListeners[event] ?? [];
      onceListeners[event] = [];
      for (const cb of pendingOnce) {
        cb();
      }
    },
    setZoom: (nextZoom: number) => {
      zoom = nextZoom;
    },
    getZoom: vi.fn(() => zoom),
    getLayer: vi.fn((id: string) => (layers.has(id) ? { id } : undefined)),
    addLayer: vi.fn((layer: { id: string }) => {
      layers.add(layer.id);
    }),
    removeLayer: vi.fn((id: string) => {
      layers.delete(id);
    }),
    setLayoutProperty: vi.fn(),
    getSource: vi.fn((id: string) => (id === "pointers" ? source : undefined)),
    addSource: vi.fn((id: string, spec: Partial<GeoJSONSource>) => {
      if (id === "pointers") {
        source = {
          ...spec,
          getClusterLeaves: vi.fn(async () => []),
        };
      }
    }),
    removeSource: vi.fn(() => {
      source = undefined;
    }),
    querySourceFeatures: vi.fn(() => []),
    addControl: vi.fn((control: { onAdd: () => HTMLElement }) => {
      control.onAdd();
    }),
    removeControl: vi.fn(),
    fitBounds: vi.fn(),
    jumpTo: vi.fn(),
  };

  return {
    map: map as unknown as Map & {
      emit: (event: string) => void;
      setZoom: (z: number) => void;
    },
    getSource: () => source,
  };
}

const clusterProperties = {
  cluster: {
    learn: { logic: ["+", 1] },
  },
  getMultipleDonutProps: vi.fn(() => [{ value: 2, color: "#2176AE" }]),
  getIndividualDonutProps: vi.fn(() => [{ value: 1, color: "#2176AE" }]),
  getPointerColor: vi.fn(() => "#2176AE"),
} as unknown as ClusterProperties;

const makePointers = (): PointerCluster[] => [
  {
    location: {
      id: "loc-1",
      lat: "52.52",
      lon: "13.405",
      bbox: ["52", "53", "13", "14"],
      addressOrName: "Berlin",
      countryCode: "DE",
      city: "Berlin",
    },
    properties: { id: "event-1", name: "Event 1" },
  },
];

describe("useClusterMap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createdMarkers.length = 0;
    useRouting().cleanupRouting();
  });

  afterEach(() => {
    useRouting().cleanupRouting();
  });

  it("throws when createDonutChart receives missing properties", () => {
    const { createDonutChart } = useClusterMap();
    expect(() => createDonutChart(undefined as never, 1)).toThrow(
      "Cluster properties are missing."
    );
  });

  it("builds an accessible donut chart element for a cluster", () => {
    const { createDonutChart } = useClusterMap();
    const el = createDonutChart(
      [
        { value: 3, color: "#2176AE" },
        { value: 2, color: "#BA3D3B" },
      ],
      42
    );

    expect(el.id).toBe("cluster-42");
    expect(el.getAttribute("role")).toBe("button");
    expect(el.textContent).toContain("5");
  });

  it("configures smaller cluster radius and lower max zoom for earlier splitting", () => {
    const { createMapForClusterTypeMap } = useClusterMap();
    const { map } = createMockMap(3);

    createMapForClusterTypeMap(
      map,
      makePointers(),
      false,
      clusterProperties,
      () => document.createElement("div") as PopupContent,
      () => document.createElement("div") as PopupContent
    );
    map.emit("load");

    expect(map.addSource).toHaveBeenCalledWith(
      "pointers",
      expect.objectContaining({
        cluster: true,
        clusterRadius: 40,
        clusterMaxZoom: 7,
      })
    );
  });

  it("transitions markers immediately when crossing DECLUSTER_ZOOM and cleans up old markers", async () => {
    const { createMapForClusterTypeMap } = useClusterMap();
    const { map } = createMockMap(3);

    map.querySourceFeatures = vi.fn(() => [
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [13.405, 52.52] },
        properties: { cluster: true, cluster_id: 99, point_count: 2 },
      } as never,
    ]);

    createMapForClusterTypeMap(
      map,
      makePointers(),
      false,
      clusterProperties,
      () => document.createElement("div") as PopupContent,
      () => document.createElement("div") as PopupContent
    );
    map.emit("load");

    await vi.waitFor(() => {
      expect(createdMarkers).toHaveLength(1);
    });
    const clusterMarker = createdMarkers[0]!;
    expect(clusterMarker.addTo).toHaveBeenCalledWith(map);
    expect(map.setLayoutProperty).toHaveBeenCalledWith(
      "clusters",
      "visibility",
      "visible"
    );
    expect(map.setLayoutProperty).toHaveBeenCalledWith(
      "cluster-count",
      "visibility",
      "visible"
    );

    // Zoom across DECLUSTER_ZOOM: unclustered feature should replace cluster immediately on "zoom".
    map.setZoom(8);
    map.querySourceFeatures = vi.fn(() => [
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [13.405, 52.52] },
        properties: { id: "event-1", name: "Event 1" },
      } as never,
    ]);
    map.emit("zoom");

    await vi.waitFor(() => {
      expect(createdMarkers).toHaveLength(2);
    });
    expect(clusterMarker.remove).toHaveBeenCalledOnce();
    expect(createdMarkers[1]!.addTo).toHaveBeenCalledWith(map);
    expect(map.setLayoutProperty).toHaveBeenCalledWith(
      "unclustered-points",
      "visibility",
      "visible"
    );
  });

  it("discards stale async getClusterLeaves results when a newer update occurs", async () => {
    const { createMapForClusterTypeMap } = useClusterMap();
    const { map, getSource } = createMockMap(8);

    let resolveLeaves!: (leaves: unknown[]) => void;
    const leavesPromise = new Promise<unknown[]>((resolve) => {
      resolveLeaves = resolve;
    });

    map.querySourceFeatures = vi.fn(() => [
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [13.405, 52.52] },
        properties: { cluster: true, cluster_id: 10, point_count: 2 },
      } as never,
    ]);

    createMapForClusterTypeMap(
      map,
      makePointers(),
      false,
      clusterProperties,
      () => document.createElement("div") as PopupContent,
      () => document.createElement("div") as PopupContent
    );

    // Override getClusterLeaves once load adds the source.
    const originalAddSource = map.addSource;
    map.addSource = vi.fn((id: string, spec: Partial<GeoJSONSource>) => {
      (originalAddSource as unknown as (id: string, spec: unknown) => void)(
        id,
        spec
      );
      const src = getSource()!;
      src.getClusterLeaves = vi.fn(() => leavesPromise as never);
    });

    map.emit("load");

    // Before the async cluster leaves resolve, user zooms back out below DECLUSTER_ZOOM.
    map.setZoom(4);
    map.emit("zoomend");

    await vi.waitFor(() => {
      expect(createdMarkers).toHaveLength(1);
    });
    const activeClusterMarker = createdMarkers[0]!;

    // Now the stale leaves promise resolves — it must NOT add leaf markers or remove the cluster marker.
    resolveLeaves([
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [13.405, 52.52] },
        properties: { id: "stale-leaf", name: "Stale", color: "#2176AE" },
      },
    ]);
    await Promise.resolve();
    await Promise.resolve();

    expect(createdMarkers).toHaveLength(1);
    expect(activeClusterMarker.remove).not.toHaveBeenCalled();
  });

  it("deduplicates repeated features and cleans up markers when map is removed", async () => {
    const { createMapForClusterTypeMap } = useClusterMap();
    const { map } = createMockMap(9);

    const duplicateFeature = {
      type: "Feature",
      geometry: { type: "Point", coordinates: [13.405, 52.52] },
      properties: { id: "event-dup", name: "Dup Event" },
    };
    map.querySourceFeatures = vi.fn(() => [
      duplicateFeature as never,
      duplicateFeature as never,
    ]);

    createMapForClusterTypeMap(
      map,
      makePointers(),
      false,
      clusterProperties,
      () => document.createElement("div") as PopupContent,
      () => document.createElement("div") as PopupContent
    );
    map.emit("load");

    await vi.waitFor(() => {
      expect(createdMarkers).toHaveLength(1);
    });

    map.emit("remove");
    expect(createdMarkers[0]!.remove).toHaveBeenCalledOnce();
  });
});
