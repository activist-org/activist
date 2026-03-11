// SPDX-License-Identifier: AGPL-3.0-or-later
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { MachineDefinition } from "../../shared/types/machine-type";

import { defineFlowMachine } from "../../shared/utils/defineMachine";

describe("defineFlowMachine", () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Intercept console.warn so it doesn't clutter the test output.
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the exact same configuration object passed to it", () => {
    const config = {
      id: "testMachine",
      initialNode: "node1",
      states: {
        node1: { type: "screen", step: 1 },
      },
    } as unknown as MachineDefinition;

    const result = defineFlowMachine(config);

    // Check strict identity, not just value equality.
    expect(result).toBe(config);
  });

  it("processes static number steps without warning", () => {
    const config = {
      id: "testMachine",
      initialNode: "node1",
      states: {
        node1: { type: "screen", step: 1 },
        node2: { type: "screen", step: 2 },
      },
    } as unknown as MachineDefinition;

    defineFlowMachine(config);
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  it("processes function-based steps without warning", () => {
    const config = {
      id: "testMachine",
      initialNode: "node1",
      states: {
        node1: { type: "screen", step: () => 1 },
        node2: { type: "screen", step: () => 2 },
      },
    } as unknown as MachineDefinition;

    defineFlowMachine(config);
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  it("ignores logic nodes when calculating steps", () => {
    const config = {
      id: "testMachine",
      initialNode: "logicNode",
      states: {
        logicNode: { type: "logic" }, // no step property
        node1: { type: "screen", step: 1 },
      },
    } as unknown as MachineDefinition;

    defineFlowMachine(config);
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  it("warns when duplicate step numbers are detected on screen nodes", () => {
    const config = {
      id: "testMachine",
      initialNode: "node1",
      states: {
        node1: { type: "screen", step: 1 },
        node2: { type: "screen", step: 1 }, // duplicate
      },
    } as unknown as MachineDefinition;

    defineFlowMachine(config);

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "[Flow] Duplicate step number 1 on node 'node2'."
    );
  });

  it("warns when duplicate function-based step numbers are detected", () => {
    const config = {
      id: "testMachine",
      initialNode: "node1",
      states: {
        node1: { type: "screen", step: () => 3 },
        node2: { type: "screen", step: () => 3 }, // duplicate
      },
    } as unknown as MachineDefinition;

    defineFlowMachine(config);

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "[Flow] Duplicate step number 3 on node 'node2'."
    );
  });
});
