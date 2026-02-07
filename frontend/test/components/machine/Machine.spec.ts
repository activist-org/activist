// SPDX-License-Identifier: AGPL-3.0-or-later
import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, inject, ref } from "vue";

import Machine from "../../../app/components/machine/Machine.vue";

// --- Mocks ---

// Mock Loading component
vi.mock("../../../app/components/Loading.vue", () => ({
  default: defineComponent({
    name: "Loading",
    props: ["loading"],
    template: '<div data-testid="loading-spinner">Loading...</div>',
  }),
}));

// Mock translation function $t
const globalMocks = {
  $t: (key: string, params: { current_step: number; total_steps: number }) =>
    `Step ${params.current_step} of ${params.total_steps}`,
};

// We will mock the composable return values dynamically
const mockFlowScreens = {
  isActive: ref(false),
  currentScreen: ref(null),
  context: ref({ currentStep: 1, totalSteps: 4 }),
  loading: ref(false),
  start: vi.fn(),
  close: vi.fn(),
  next: vi.fn(),
  prev: vi.fn(),
};

// Mock the composable itself
vi.mock("../../../app/composables/useFlowScreens", () => ({
  useFlowScreens: () => mockFlowScreens,
}));

describe("Machine.vue", () => {
  beforeEach(() => {
    // Reset mocks
    mockFlowScreens.isActive.value = false;
    mockFlowScreens.currentScreen.value = null;
    mockFlowScreens.loading.value = false;
    mockFlowScreens.context.value = { currentStep: 1, totalSteps: 4 };
    vi.clearAllMocks();
  });

  it("does not render anything when inactive", () => {
    const wrapper = mount(Machine, {
      props: { machineType: "createEventFlow" },
      global: { mocks: globalMocks },
    });

    expect(wrapper.html()).toBe("<!--v-if-->");
  });

  it("renders the progress bar and text when active", async () => {
    const wrapper = mount(Machine, {
      props: { machineType: "createEventFlow" },
      global: { mocks: globalMocks },
    });

    mockFlowScreens.isActive.value = true;
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Step 1 of 4");

    // Check progress bar width
    const progressBar = wrapper.find(".bg-cta-orange");
    expect(progressBar.exists()).toBe(true);
    // 1 / 4 = 25%
    expect(progressBar.attributes("style")).toContain("width: 25%");
  });

  it("renders the Loading component when loading is true and no screen is present", async () => {
    const wrapper = mount(Machine, {
      props: { machineType: "createEventFlow" },
      global: { mocks: globalMocks },
    });

    mockFlowScreens.isActive.value = true;
    mockFlowScreens.loading.value = true;
    mockFlowScreens.currentScreen.value = null;
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent({ name: "Loading" }).exists()).toBe(true);
    expect(wrapper.find('[data-testid="loading-spinner"]').exists()).toBe(true);
  });

  it("renders the current screen component when resolved", async () => {
    const TestStepComponent = defineComponent({
      template: '<div data-testid="step-content">Step Content</div>',
    });

    const wrapper = mount(Machine, {
      props: { machineType: "createEventFlow" },
      global: { mocks: globalMocks },
    });

    mockFlowScreens.isActive.value = true;
    mockFlowScreens.currentScreen.value = TestStepComponent;
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-testid="step-content"]').exists()).toBe(true);
    expect(wrapper.findComponent({ name: "Loading" }).exists()).toBe(false);
  });

  it("provides flow actions to child components", async () => {
    // Create a child component that tries to inject the flow
    const ChildComponent = defineComponent({
      setup() {
        const flow = inject("flow");
        return { flow };
      },
      template: `
        <div>
          <button @click="flow.next({ foo: 'bar' })">Next</button>
          <button @click="flow.prev()">Prev</button>
        </div>
      `,
    });

    const wrapper = mount(Machine, {
      props: { machineType: "createEventFlow" },
      global: { mocks: globalMocks },
    });

    mockFlowScreens.isActive.value = true;
    mockFlowScreens.currentScreen.value = ChildComponent;
    await wrapper.vm.$nextTick();

    // Trigger actions from child
    await wrapper.find("button").trigger("click"); // Next

    expect(mockFlowScreens.next).toHaveBeenCalledWith({ foo: "bar" });
  });

  it("emits 'close' event when close action is called via provide", async () => {
    const ChildComponent = defineComponent({
      setup() {
        const flow = inject("flow");
        return { flow };
      },
      template: `<button @click="flow.close(true)">Close</button>`,
    });

    const wrapper = mount(Machine, {
      props: { machineType: "createEventFlow" },
      global: { mocks: globalMocks },
    });

    mockFlowScreens.isActive.value = true;
    mockFlowScreens.currentScreen.value = ChildComponent;
    await wrapper.vm.$nextTick();

    await wrapper.find("button").trigger("click");

    expect(mockFlowScreens.close).toHaveBeenCalledWith(true);
    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("updates progress bar width dynamically", async () => {
    const wrapper = mount(Machine, {
      props: { machineType: "createEventFlow" },
      global: { mocks: globalMocks },
    });

    mockFlowScreens.isActive.value = true;
    // Step 3 of 4 = 75%
    mockFlowScreens.context.value = { currentStep: 3, totalSteps: 4 };
    await wrapper.vm.$nextTick();

    const progressBar = wrapper.find(".bg-cta-orange");
    expect(progressBar.attributes("style")).toContain("width: 75%");
  });
});
