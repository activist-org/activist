// SPDX-License-Identifier: AGPL-3.0-or-later
import type MapLibreGlDirections from "@maplibre/maplibre-gl-directions";
import type { Map } from "maplibre-gl";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { usePointerMap, useRouting } from "../../../app/composables";

const { MockMarker, MockPopup, MockDirections, mockLayersFactory } = vi.hoisted(
  () => {
    const MockMarker = vi.fn().mockImplementation(function (
      this: Record<string, unknown>
    ) {
      const el = document.createElement("div");
      this.getElement = vi.fn(() => el);
      this.addClassName = vi.fn().mockReturnThis();
      this.setLngLat = vi.fn().mockReturnThis();
      this.setPopup = vi.fn().mockReturnThis();
      this.addTo = vi.fn().mockReturnThis();
    });

    const MockPopup = vi.fn().mockImplementation(function (
      this: Record<string, unknown>
    ) {
      this.setDOMContent = vi.fn().mockReturnThis();
    });

    const MockDirections = vi.fn().mockImplementation(function (
      this: Record<string, unknown>
    ) {
      this.waypoints = [];
      this.interactive = true;
      this.clear = vi.fn();
      this.destroy = vi.fn();
    });

    return {
      MockMarker,
      MockPopup,
      MockDirections,
      mockLayersFactory: vi.fn(() => []),
    };
  }
);

vi.mock("maplibre-gl", () => ({
  Marker: MockMarker,
  Popup: MockPopup,
}));

vi.mock("@maplibre/maplibre-gl-directions", () => ({
  default: MockDirections,
  layersFactory: mockLayersFactory,
}));

vi.stubGlobal("useI18n", () => ({
  t: vi.fn((key: string) => key),
}));

const samplePointer: Pointer = {
  id: "evt-1",
  color: "#2176AE",
  location: {
    id: "loc-1",
    lat: "52.52",
    lon: "13.405",
    bbox: ["52.4", "52.6", "13.2", "13.6"],
    addressOrName: "Berlin",
    countryCode: "DE",
    city: "Berlin",
  },
  popup: document.createElement("div"),
};

describe("usePointerMap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useRouting().cleanupRouting();
  });

  afterEach(() => {
    useRouting().cleanupRouting();
  });

  it("creates an accessible marker and toggles the active directions instance on hover", () => {
    const routing = useRouting();
    const { createPointerMarker } = usePointerMap();

    const initialDirections = { interactive: false } as MapLibreGlDirections;
    const replacementDirections = { interactive: true } as MapLibreGlDirections;
    routing.setDirections(initialDirections);

    const marker = createPointerMarker(samplePointer, initialDirections);
    const el = marker.getElement();

    expect(el.id).toBe("pointer-evt-1");
    expect(el.getAttribute("role")).toBe("button");
    expect(initialDirections.interactive).toBe(true);

    // Swap active directions (as happens on bike/walk profile switch).
    routing.setDirections(replacementDirections);

    el.dispatchEvent(new MouseEvent("mouseenter"));
    expect(replacementDirections.interactive).toBe(false);
    expect(initialDirections.interactive).toBe(true);

    el.dispatchEvent(new MouseEvent("mouseleave"));
    expect(replacementDirections.interactive).toBe(true);
  });

  it("initializes pointer map bounds, directions, and marker on load", () => {
    const { createMapForPointerTypeMap } = usePointerMap();
    let loadHandler: (() => void) | undefined;

    const map = {
      fitBounds: vi.fn(),
      on: vi.fn((event: string, cb: () => void) => {
        if (event === "load") {
          loadHandler = cb;
        }
      }),
      addControl: vi.fn(),
      removeControl: vi.fn(),
    } as unknown as Map;

    createMapForPointerTypeMap(map, samplePointer, false);
    expect(map.fitBounds).toHaveBeenCalledWith(
      [
        [13.2, 52.4],
        [13.6, 52.6],
      ],
      { duration: 0, padding: 120 }
    );

    loadHandler?.();
    expect(MockDirections).toHaveBeenCalledOnce();
    expect(MockMarker).toHaveBeenCalledOnce();
  });
});
