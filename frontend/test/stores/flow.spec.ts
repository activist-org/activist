// SPDX-License-Identifier: AGPL-3.0-or-later
import { mount } from "@vue/test-utils"; // Required to trigger onMounted
import { defineStore, setActivePinia, createPinia } from "pinia";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { nextTick, markRaw, defineComponent } from "vue";

import type { NodeConfig } from "../../shared/types/machine-type";

import { useFlowScreens } from "../../app/composables/useFlowScreens";

// MARK: Mocks & Setup

const MockComponent = markRaw({ template: "<div>Screen</div>" });

// Mock Store Factory.
const useMockStore = defineStore("mock-flow", {
  state: () => ({
    active: false,
    currentNode: null as NodeConfig | null,
    nodeData: {},
    sharedData: {},
    isFinished: false,
    saveResult: null as Record<string, unknown> | null,
    _history: [] as string[],
    saving: false,
  }),
  getters: {
    nodeId: (state) => state.currentNode?.id,
    currentStep: () => 1,
    totalSteps: () => 3,
  },
  actions: {
    start(draft?: NodeConfig) {
      this.active = true;
      if (draft) this.nodeData = draft;
    },
    close() {
      this.active = false;
    },
    async next() {
      /* spyable */
    },
    prev() {
      /* spyable */
    },
    setSharedData: vi.fn(function (this:unknown, data) {
      this.sharedData = { ...this.sharedData, ...data };
    }),
  },
});

// Mock the registry.
vi.mock("../../app/stores/machines/index", () => ({
  machineRegistry: {
    testMachine: () => useMockStore(),
  },
}));

describe("useFlowScreens", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("initializes with default state", () => {
    const { isActive, currentScreen, loading } = useFlowScreens("testMachine");

    expect(isActive.value).toBe(false);
    expect(currentScreen.value).toBeNull();
    expect(loading.value).toBe(false);
  });

  it("starts the store when autoStart is true", async () => {
    const store = useMockStore();
    const startSpy = vi.spyOn(store, "start");

    const TestComponent = defineComponent({
      setup() {
        useFlowScreens("testMachine", {
          autoStart: true,
          startData: { foo: "bar" },
        });
        return {};
      },
      template: "<div></div>",
    });

    mount(TestComponent);

    expect(startSpy).toHaveBeenCalledWith({ foo: "bar" });
    expect(store.active).toBe(true);
  });

  it("resolves and renders a synchronous component node", async () => {
    const store = useMockStore();
    const { currentScreen } = useFlowScreens("testMachine");

    store.currentNode = {
      id: "step1",
      type: "screen",
      component: MockComponent,
    };
    store.active = true;

    await nextTick();

    expect(currentScreen.value).toEqual(MockComponent);
  });

  it("resolves and renders a lazy-loaded component (async factory)", async () => {
    const store = useMockStore();
    const { currentScreen, loading } = useFlowScreens("testMachine");

    const AsyncComponentFactory = vi
      .fn()
      .mockResolvedValue({ default: MockComponent });

    store.active = true;
    store.currentNode = {
      id: "step2",
      type: "screen",
      component: AsyncComponentFactory,
    };

    await nextTick();
    await new Promise((r) => setTimeout(r, 0));

    expect(AsyncComponentFactory).toHaveBeenCalled();
    expect(currentScreen.value).toEqual(MockComponent);
    expect(loading.value).toBe(false);
  });

  it("auto-advances (skips) logic nodes", async () => {
    const store = useMockStore();
    const nextSpy = vi.spyOn(store, "next");
    const { currentScreen } = useFlowScreens("testMachine");

    store.active = true;
    store.currentNode = {
      id: "logicStep",
      type: "logic",
      next: () => "step2",
    };

    await nextTick();

    expect(currentScreen.value).toBeNull();
    expect(nextSpy).toHaveBeenCalled();
  });

  it("handles action nodes by executing onAction, saving result, and auto-advancing", async () => {
    const store = useMockStore();
    const nextSpy = vi.spyOn(store, "next");
    const onActionSpy = vi.fn().mockResolvedValue({ id: "123" });

    const { currentScreen } = useFlowScreens("testMachine", {
      onAction: onActionSpy,
    });

    store.nodeData = { some: "data" };
    store.active = true;
    store.currentNode = {
      id: "actionStep",
      type: "action",
      next: () => "step2",
    };

    await nextTick();
    await new Promise((r) => setTimeout(r, 0)); // wait for promise inside watcher

    expect(currentScreen.value).toBeNull();
    expect(onActionSpy).toHaveBeenCalledWith(store.nodeData);
    expect(store.setSharedData).toHaveBeenCalledWith({
      __lastActionResult: { id: "123" },
    });
    expect(nextSpy).toHaveBeenCalled();
  });

  it("calls onSubmit callback when flow finishes, merging nodeData and sharedData", async () => {
    const store = useMockStore();
    const onSubmitSpy = vi.fn();

    useFlowScreens("testMachine", {
      onSubmit: onSubmitSpy,
    });

    store.nodeData = { step1: "data" };
    store.sharedData = { meta: "info" };
    store.isFinished = true;

    await nextTick();
    await new Promise((r) => setTimeout(r, 0)); // Wait for promise resolution

    expect(onSubmitSpy).toHaveBeenCalledWith({ step1: "data", meta: "info" });
  });

  it("calls onNodeEnter callback when entering a screen", async () => {
    const store = useMockStore();
    const onNodeEnterSpy = vi.fn();

    useFlowScreens("testMachine", {
      onNodeEnter: onNodeEnterSpy,
    });

    store.active = true;
    store.currentNode = {
      id: "step1",
      type: "screen",
      component: MockComponent,
    };

    await nextTick();

    expect(onNodeEnterSpy).toHaveBeenCalledWith("step1");
  });

  it("exposes reactive context correctly", () => {
    const store = useMockStore();
    const { context } = useFlowScreens("testMachine");

    store.active = true;
    store.currentNode = { id: "step1", step: 1 };

    expect(context.value.active).toBe(true);
    expect(context.value.nodeId).toBe("step1");
    expect(context.value.currentStep).toBe(1);
  });
});
