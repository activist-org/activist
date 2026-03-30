import maplibregl from "maplibre-gl";
// SPDX-License-Identifier: AGPL-3.0-or-later
import { beforeEach, describe, expect, it, vi } from "vitest";

// 5. Import the composable under test
import { useMap } from "../../../app/composables";

// 1. Use vi.hoisted to define variables that need to be accessed in vi.mock
const {
  MockMap,
  MockNavigationControl,
  MockFullscreenControl,
  MockGeolocateControl,
  mockCreateMapForPointerTypeMap,
  mockCreateMapForClusterTypeMap,
} = vi.hoisted(() => {
  return {
    MockMap: vi.fn().mockImplementation(function (this: any) {
      this.addControl = vi.fn();
      this.getContainer = vi.fn(() => ({
        querySelector: vi.fn(() => ({ title: "" })),
      }));
      this.loadImage = vi.fn().mockReturnValue(Promise.resolve({ data: "mock-image-data" }));
      this.addImage = vi.fn();
      this.on = vi.fn((event, cb) => {
        if (event === "load") cb();
      });
      this.resize = vi.fn();
      this.getLayer = vi.fn();
      this.getSource = vi.fn();
      this.jumpTo = vi.fn();
      this.fitBounds = vi.fn();
    }),
    MockNavigationControl: vi.fn().mockImplementation(function () {}),
    MockFullscreenControl: vi.fn().mockImplementation(function () {}),
    MockGeolocateControl: vi.fn().mockImplementation(function () {}),
    mockCreateMapForPointerTypeMap: vi.fn(),
    mockCreateMapForClusterTypeMap: vi.fn(),
  };
});

vi.mock("../../../app/composables/map/usePointerMap", () => {
  const mock = () => ({
    createMapForPointerTypeMap: mockCreateMapForPointerTypeMap,
    createPointerMarker: vi.fn(),
  });
  return {
    usePointerMap: mock,
    default: mock,
  };
});

vi.mock("../../../app/composables/map/useClusterMap", () => {
  const mock = () => ({
    createMapForClusterTypeMap: mockCreateMapForClusterTypeMap,
    createDonutChart: vi.fn(),
    donutSegment: vi.fn(),
  });
  return {
    useClusterMap: mock,
    default: mock,
  };
});

vi.mock("../../../app/composables/map/useRoutingMap", () => {
  const mock = () => ({
    addDirectionsLayer: vi.fn(),
    setSelectedRoute: vi.fn(),
    resetDirectionsControl: vi.fn(),
    setDirections: vi.fn(),
    setMap: vi.fn(),
    setMarker: vi.fn(),
  });
  return {
    useRouting: mock,
    default: mock,
  };
});

// 3. Mock maplibre-gl
vi.mock("maplibre-gl", () => {
  return {
    default: {
      Map: MockMap,
      NavigationControl: MockNavigationControl,
      FullscreenControl: MockFullscreenControl,
      GeolocateControl: MockGeolocateControl,
    },
    Map: MockMap,
    NavigationControl: MockNavigationControl,
    FullscreenControl: MockFullscreenControl,
    GeolocateControl: MockGeolocateControl,
  };
});

// 4. Stub useI18n globally
vi.stubGlobal("useI18n", () => ({
  t: vi.fn((key: string) => key),
}));

describe("useMap", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock WebGL support
    vi.stubGlobal("document", {
      createElement: vi.fn(() => ({
        getContext: vi.fn((type) => {
          if (type === "webgl2" || type === "webgl") {
            return { getParameter: vi.fn() };
          }
          return null;
        }),
      })),
    });

    vi.stubGlobal("window", {
      WebGLRenderingContext: true,
    });
  });

  it("should expose expected functions and integrated composables", () => {
    const mapComposable = useMap();
    expect(mapComposable.isWebglSupported).toBeDefined();
    expect(mapComposable.createMap).toBeDefined();
    expect(mapComposable.createFullScreenControl).toBeDefined();
    expect(mapComposable.createMapForPointerTypeMap).toBe(mockCreateMapForPointerTypeMap);
    expect(mapComposable.createMapForClusterTypeMap).toBe(mockCreateMapForClusterTypeMap);
    expect(mapComposable.addDefaultControls).toBeDefined();
  });

  describe("isWebglSupported", () => {
    it("returns true when WebGL is available", () => {
      const { isWebglSupported } = useMap();
      expect(isWebglSupported()).toBe(true);
    });

    it("returns false when WebGLRenderingContext is missing", () => {
      vi.stubGlobal("window", { WebGLRenderingContext: undefined });
      const { isWebglSupported } = useMap();
      expect(isWebglSupported()).toBe(false);
    });
  });

  describe("createMap", () => {
    it("initializes maplibre Map with correct configuration", () => {
      const { createMap } = useMap();
      const layers = [{ id: "test-layer" }] as any;
      const map = createMap(layers);

      expect(maplibregl.Map).toHaveBeenCalledWith(expect.objectContaining({
        container: "map",
        center: [0, 20],
        zoom: 1.5,
        style: expect.objectContaining({
          layers: layers,
        }),
      }));
      expect(map).toBeDefined();
    });

    it("triggers resize on map load", () => {
      const { createMap } = useMap();
      const map = createMap([]);
      expect(map.resize).toHaveBeenCalled();
    });
  });

  describe("createFullScreenControl", () => {
    it("creates a new FullscreenControl instance", () => {
      const { createFullScreenControl } = useMap();
      createFullScreenControl();
      expect(maplibregl.FullscreenControl).toHaveBeenCalled();
    });
  });

  describe("addDefaultControls", () => {
    it("adds all default controls and sets localized titles", async () => {
      const { addDefaultControls } = useMap();

      const mockElements: Record<string, { title: string }> = {
        ".maplibregl-ctrl-fullscreen": { title: "" },
        ".maplibregl-ctrl-zoom-in": { title: "" },
        ".maplibregl-ctrl-zoom-out": { title: "" },
        ".maplibregl-ctrl-compass": { title: "" },
        ".maplibregl-ctrl-geolocate": { title: "" },
      };

      // Create a mock instance of Map
      const mockMapInstance = new maplibregl.Map({} as any);
      // Override its getContainer to return our mock elements
      mockMapInstance.getContainer = vi.fn(() => ({
        querySelector: vi.fn((selector: string) => mockElements[selector]),
      })) as never;

      addDefaultControls(mockMapInstance);

      expect(mockMapInstance.addControl).toHaveBeenCalledTimes(3);
      expect(mockElements[".maplibregl-ctrl-zoom-in"].title).toBe("i18n.composables.use_map.zoom_in");

      await vi.waitFor(() => {
        expect(mockMapInstance.loadImage).toHaveBeenCalledWith("/icons/from_library/bootstrap_arrow_right.png");
        expect(mockMapInstance.addImage).toHaveBeenCalledWith("route-direction-arrow", expect.anything());
      });
    });
  });
});
