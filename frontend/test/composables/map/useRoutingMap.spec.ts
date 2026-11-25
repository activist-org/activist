// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LayerSpecification, Map } from "maplibre-gl";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useRouting } from "../../../app/composables";

const { MockDirections, createdDirections } = vi.hoisted(() => {
  const createdDirections: Array<{
    waypoints: unknown[];
    interactive: boolean;
    clear: ReturnType<typeof vi.fn>;
    destroy: ReturnType<typeof vi.fn>;
  }> = [];

  const MockDirections = vi.fn().mockImplementation(function (
    this: Record<string, unknown>
  ) {
    const instance = {
      waypoints: [] as unknown[],
      interactive: true,
      clear: vi.fn(),
      destroy: vi.fn(),
    };
    Object.assign(this, instance);
    createdDirections.push(instance);
    return instance;
  });

  return { MockDirections, createdDirections };
});

vi.mock("@maplibre/maplibre-gl-directions", () => ({
  default: MockDirections,
}));

vi.stubGlobal("useI18n", () => ({
  t: vi.fn((key: string) => key),
}));

function createMockMap() {
  const controls: Array<{ onAdd: () => HTMLElement; onRemove?: () => void }> =
    [];
  const mountedElements: HTMLElement[] = [];

  const map = {
    addControl: vi.fn(
      (control: { onAdd: () => HTMLElement; onRemove?: () => void }) => {
        controls.push(control);
        const el = control.onAdd();
        mountedElements.push(el);
        document.body.appendChild(el);
      }
    ),
    removeControl: vi.fn(
      (control: { onAdd: () => HTMLElement; onRemove?: () => void }) => {
        const idx = controls.indexOf(control);
        if (idx !== -1) {
          controls.splice(idx, 1);
          const [el] = mountedElements.splice(idx, 1);
          el?.remove();
        }
        control.onRemove?.();
      }
    ),
    getLayer: vi.fn(() => ({ id: "cycle-layer" })),
    setLayoutProperty: vi.fn(),
  };

  return {
    map: map as unknown as Map,
    controls,
  };
}

describe("useRouting", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createdDirections.length = 0;
    document.body.innerHTML = "";
    Object.defineProperty(window, "innerWidth", {
      value: 1024,
      writable: true,
      configurable: true,
    });
    useRouting().cleanupRouting();
  });

  afterEach(() => {
    useRouting().cleanupRouting();
    document.body.innerHTML = "";
  });

  it("shares routing state across calls and cleans up properly", () => {
    const first = useRouting();
    const second = useRouting();
    const { map } = createMockMap();

    first.setMap(map);
    const directions = first.addDirectionsLayer(
      map,
      [{ id: "base-layer", type: "line" } as LayerSpecification],
      first.mapProfile("foot")!
    );

    expect(second.directionsRef.value).toBe(directions);

    second.cleanupRouting();
    expect(directions.destroy).toHaveBeenCalledOnce();
    expect(first.directionsRef.value).toBeNull();
  });

  it("does not mutate caller layers or duplicate the direction arrow layer across toggles", () => {
    const routing = useRouting();
    const { map } = createMockMap();
    const initialLayers: LayerSpecification[] = [
      { id: "base-route", type: "line" } as LayerSpecification,
    ];

    routing.setMap(map);
    routing.addDirectionsLayer(map, initialLayers, routing.mapProfile("foot")!);
    routing.resetDirectionsControl();

    // Caller's input array must remain untouched.
    expect(initialLayers).toHaveLength(1);

    const profileControl = document.getElementById("route-profile-control")!;
    expect(profileControl).not.toBeNull();

    // Switch foot -> bike -> foot -> bike repeatedly.
    profileControl.click();
    profileControl.click();
    profileControl.click();

    expect(MockDirections).toHaveBeenCalledTimes(4);
    for (const call of MockDirections.mock.calls) {
      const layersArg = call[1].layers as LayerSpecification[];
      const arrowLayers = layersArg.filter(
        (l) => l.id === "maplibre-gl-directions-route-line-direction-arrow"
      );
      expect(arrowLayers).toHaveLength(1);
    }
    expect(createdDirections[0]!.destroy).toHaveBeenCalledOnce();
    expect(createdDirections[1]!.destroy).toHaveBeenCalledOnce();
    expect(createdDirections[2]!.destroy).toHaveBeenCalledOnce();
  });

  it("does not leak keydown listeners or controls when resetting directions on repeated clicks", () => {
    const routing = useRouting();
    const { map, controls } = createMockMap();

    routing.setMap(map);
    routing.addDirectionsLayer(map, [], routing.mapProfile("foot")!);

    // Simulate adding multiple waypoints causing repeated resetDirectionsControl calls.
    for (let i = 0; i < 10; i++) {
      routing.resetDirectionsControl();
    }

    // Exactly two active controls: directions-control + route-profile-control.
    expect(controls).toHaveLength(2);

    // Pressing "p" once must toggle profile exactly once, not 10 times.
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "p", bubbles: true })
    );

    expect(routing.selectedRoute.value?.profile).toBe("bike");
    expect(MockDirections).toHaveBeenCalledTimes(2);

    // Pressing "x" once clears the active directions exactly once.
    const latestDirections = createdDirections[createdDirections.length - 1]!;
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "x", bubbles: true })
    );
    expect(latestDirections.clear).toHaveBeenCalledOnce();
  });

  it("ignores keyboard shortcuts when focus is inside an input element", () => {
    const routing = useRouting();
    const { map } = createMockMap();

    routing.setMap(map);
    routing.addDirectionsLayer(map, [], routing.mapProfile("foot")!);
    routing.resetDirectionsControl();

    const input = document.createElement("input");
    document.body.appendChild(input);

    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "p", bubbles: true })
    );
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "x", bubbles: true })
    );

    expect(routing.selectedRoute.value?.profile).toBe("foot");
    expect(createdDirections[0]!.clear).not.toHaveBeenCalled();
  });

  it("handles toggleLayerHandler safely when cycle-layer is absent", () => {
    const routing = useRouting();
    const { map } = createMockMap();
    map.getLayer = vi.fn(() => undefined);

    expect(() => routing.toggleLayerHandler(map)).not.toThrow();
    expect(map.setLayoutProperty).not.toHaveBeenCalled();
  });
});
