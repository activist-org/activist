import { setActivePinia, createPinia } from "pinia";
import { describe, it, expect, beforeEach, vi } from "vitest";

import type {
  FlowContext,
  MachineDefinition,
} from "../../shared/types/machine-type.d";

import { createFlowStore } from "../../app/stores/machines/flow"; // Adjust path as needed

// Mock component object for testing "screen" nodes
const MockComponent = { template: "<div>Step</div>" };

describe("createFlowStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  const machineConfig = {
    id: "test-flow",
    initialNode: "step1",
    states: {
      step1: {
        label: "Step 1",
        type: "screen",
        component: MockComponent,
        initialData: { name: "initial" },
        next: "step2",
      },
      step2: {
        label: "Step 2",
        type: "screen",
        component: MockComponent,
        next: "logicNode",
      },
      logicNode: {
        label: "Logic",
        type: "logic",
        // Logic node decides path based on data from step2
        next: (ctx: FlowContext) => {
          const step2Data = ctx.allNodeData.step2;
          return (step2Data as Record<string, unknown>)?.skipStep3
            ? "end"
            : "step3";
        },
      },
      step3: {
        label: "Step 3",
        type: "screen",
        component: MockComponent,
        next: "end",
      },
    },
  };

  it("initializes with the correct default state", () => {
    const useStore = createFlowStore({
      machine: machineConfig as MachineDefinition,
    });
    const store = useStore();

    expect(store.active).toBe(false);
    expect(store.nodeId).toBe("step1");
    expect(store.currentNode?.label).toBe("Step 1");
    // Check initial data extraction
    expect(store.nodeData.step1).toEqual({ name: "initial" });
    expect(store.nodeData.step2).toEqual({});
  });

  it("starts the flow correctly", () => {
    const useStore = createFlowStore({
      machine: machineConfig as MachineDefinition,
    });
    const store = useStore();

    store.start();
    expect(store.active).toBe(true);
    expect(store.nodeId).toBe("step1");
  });

  it("merges draft data when starting", () => {
    const useStore = createFlowStore({
      machine: machineConfig as MachineDefinition,
    });
    const store = useStore();

    store.start({ step1: { name: "draft-name" } });
    expect(store.nodeData.step1).toEqual({ name: "draft-name" });
  });

  it("navigates to the next step and saves data", async () => {
    const useStore = createFlowStore({
      machine: machineConfig as MachineDefinition,
    });
    const store = useStore();
    store.start();

    // Move from step1 to step2 with payload
    await store.next({ name: "updated" });

    expect(store.nodeId).toBe("step2");
    expect(store.nodeData.step1).toEqual({ name: "updated" });
    expect(store.history).toContain("step1");
  });

  it("handles logic nodes correctly (skipping screens)", async () => {
    const useStore = createFlowStore({
      machine: machineConfig as MachineDefinition,
    });
    const store = useStore();
    store.start();

    // Step 1 -> Step 2
    await store.next();
    expect(store.nodeId).toBe("step2");

    // Step 2 -> Logic Node.
    // We pass data { skipStep3: true }.
    // Logic node should see this and return "end", causing a submit.
    await store.next({ skipStep3: true });
    await store.next(); // to process submit
    expect(store.isFinished).toBe(true);
    // Logic nodes should NOT be in history, only screens
    expect(store.history).toEqual(["step1", "step2"]);
  });

  it("handles logic nodes traversing to next screen", async () => {
    const useStore = createFlowStore({
      machine: machineConfig as MachineDefinition,
    });
    const store = useStore();
    store.start();

    // Step 1 -> Step 2
    await store.next();

    // Step 2 -> Logic Node -> Step 3
    // We pass { skipStep3: false }, so logic node returns "step3"
    await store.next({ skipStep3: false });
    await store.next(); // to step3
    expect(store.nodeId).toBe("step3");
  });

  it("executes onExit side effects", async () => {
    const onExitSpy = vi.fn();
    const configWithSideEffect = {
      ...machineConfig,
      states: {
        ...machineConfig.states,
        step1: {
          ...machineConfig.states.step1,
          onExit: onExitSpy,
        },
      },
    };

    const useStore = createFlowStore({
      machine: configWithSideEffect as MachineDefinition,
    });
    const store = useStore();
    store.start();

    await store.next({ foo: "bar" });

    expect(onExitSpy).toHaveBeenCalledTimes(1);
    // Check if onExit received the correct context and data
    expect(onExitSpy).toHaveBeenCalledWith(
      expect.objectContaining({ allNodeData: expect.any(Object) }),
      { name: "initial", foo: "bar" } // merged data
    );
  });

  it("goes back to the previous step correctly", async () => {
    const useStore = createFlowStore({
      machine: machineConfig as MachineDefinition,
    });
    const store = useStore();
    store.start();

    await store.next(); // to step 2
    expect(store.nodeId).toBe("step2");

    store.prev();
    expect(store.nodeId).toBe("step1");
    // History should pop
    expect(store.history).toHaveLength(0);
  });

  it("flattens data and submits when flow ends", async () => {
    const useStore = createFlowStore({
      machine: machineConfig as MachineDefinition,
    });
    const store = useStore();
    store.start();

    await store.next({ field1: "A" }); // step 1 -> step 2
    await store.next({ field2: "B" }); // step 2 -> logic
    // Logic node directs to 'end' based on default logic or mocked behavior?
    // Let's force a skip to end
    await store.next({ skipStep3: true });
    await store.next(); // to process submit
    expect(store.isFinished).toBe(true);
    expect(store.active).toBe(false);
    expect(store.saveResult).toEqual(
      expect.objectContaining({
        field1: "A",
        field2: "B",
      })
    );
  });

  it("calculates current step number correctly", async () => {
    const useStore = createFlowStore({
      machine: machineConfig as MachineDefinition,
    });
    const store = useStore();

    // Total visible steps = 3 (step1, step2, step3)
    expect(store.totalSteps).toBe(3);

    store.start();
    expect(store.currentStep).toBe(1);

    await store.next();
    expect(store.currentStep).toBe(2);
  });

  it("resets to initial state correctly", async () => {
    const useStore = createFlowStore({
      machine: machineConfig as MachineDefinition,
    });
    const store = useStore();
    store.start();

    await store.next({ name: "changed" });

    store.close(true); // discard = true

    expect(store.active).toBe(false);
    expect(store.nodeId).toBe("step1");
    expect(store.nodeData.step1).toEqual({ name: "initial" }); // Data reset
    expect(store.history).toEqual([]);
  });
});
