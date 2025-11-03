// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/vue";

import SidebarLeft from "../../../../app/components/sidebar/left/SidebarLeft.vue";
import render from "../../../../test/render";

// Mock useSidebar composable
vi.mock("../../../../app/composables/useSidebar", () => ({
  useSidebar: () => ({
    collapsed: false,
    collapsedSwitch: false,
  }),
}));

// Mock useRoute
vi.mock("vue-router", () => ({
  useRoute: () => ({
    query: {},
    path: "/",
  }),
  useRouter: () => ({
    push: vi.fn(),
    currentRoute: {
      value: {
        name: "home",
      },
    },
  }),
}));

describe("SidebarLeft.vue", () => {
  it("renderiza o sidebar com as classes base corretas", async () => {
    const { container } = await render(SidebarLeft, {
      global: {
        stubs: {
          SidebarLeftHeader: {
            template: "<div data-testid='sidebar-header'></div>",
          },
          SearchBar: {
            template: "<div data-testid='search-bar'></div>",
            props: ["modelValue", "location"],
            emits: ["update:modelValue"],
          },
          SidebarLeftMainSectionSelectors: {
            template: "<div data-testid='main-selectors'></div>",
          },
          SidebarLeftContent: {
            template: "<div data-testid='sidebar-content'></div>",
            props: ["logoUrl", "name", "sidebarType"],
          },
          SidebarLeftFilter: {
            template: "<div data-testid='sidebar-filter'></div>",
            props: ["sidebarType"],
          },
          SidebarLeftFooter: {
            template: "<div data-testid='sidebar-footer'></div>",
            props: ["sidebarContentScrollable"],
          },
          Icon: {
            template: "<span data-testid='icon'></span>",
            props: ["name", "size"],
          },
        },
      },
    });

    const sidebar = container.querySelector("#sidebar-left");
    expect(sidebar).toBeDefined();
    expect(sidebar?.className).toContain("absolute");
    expect(sidebar?.className).toContain("z-40");
    expect(sidebar?.className).toContain("h-full");
  });

  it("renderiza com role navigation", async () => {
    const { container } = await render(SidebarLeft, {
      global: {
        stubs: {
          SidebarLeftHeader: { template: "<div></div>" },
          SearchBar: { template: "<div></div>", props: ["modelValue", "location"], emits: ["update:modelValue"] },
          SidebarLeftMainSectionSelectors: { template: "<div></div>" },
          SidebarLeftContent: { template: "<div></div>", props: ["logoUrl", "name", "sidebarType"] },
          SidebarLeftFilter: { template: "<div></div>", props: ["sidebarType"] },
          SidebarLeftFooter: { template: "<div></div>", props: ["sidebarContentScrollable"] },
          Icon: { template: "<span></span>", props: ["name", "size"] },
        },
      },
    });

    const sidebar = container.querySelector("#sidebar-left");
    expect(sidebar?.getAttribute("role")).toBe("navigation");
  });

  it("renderiza com aria-label correto", async () => {
    const { container } = await render(SidebarLeft, {
      global: {
        stubs: {
          SidebarLeftHeader: { template: "<div></div>" },
          SearchBar: { template: "<div></div>", props: ["modelValue", "location"], emits: ["update:modelValue"] },
          SidebarLeftMainSectionSelectors: { template: "<div></div>" },
          SidebarLeftContent: { template: "<div></div>", props: ["logoUrl", "name", "sidebarType"] },
          SidebarLeftFilter: { template: "<div></div>", props: ["sidebarType"] },
          SidebarLeftFooter: { template: "<div></div>", props: ["sidebarContentScrollable"] },
          Icon: { template: "<span></span>", props: ["name", "size"] },
        },
      },
    });

    const sidebar = container.querySelector("#sidebar-left");
    expect(sidebar?.getAttribute("aria-label")).toBeDefined();
  });

  it("renderiza SidebarLeftHeader", async () => {
    await render(SidebarLeft, {
      global: {
        stubs: {
          SidebarLeftHeader: {
            template: "<div data-testid='sidebar-header'></div>",
          },
          SearchBar: { template: "<div></div>", props: ["modelValue", "location"], emits: ["update:modelValue"] },
          SidebarLeftMainSectionSelectors: { template: "<div></div>" },
          SidebarLeftContent: { template: "<div></div>", props: ["logoUrl", "name", "sidebarType"] },
          SidebarLeftFilter: { template: "<div></div>", props: ["sidebarType"] },
          SidebarLeftFooter: { template: "<div></div>", props: ["sidebarContentScrollable"] },
          Icon: { template: "<span></span>", props: ["name", "size"] },
        },
      },
    });

    const header = screen.getByTestId("sidebar-header");
    expect(header).toBeDefined();
  });

  it("renderiza SearchBar", async () => {
    await render(SidebarLeft, {
      global: {
        stubs: {
          SidebarLeftHeader: { template: "<div></div>" },
          SearchBar: {
            template: "<div data-testid='search-bar'></div>",
            props: ["modelValue", "location"],
            emits: ["update:modelValue"],
          },
          SidebarLeftMainSectionSelectors: { template: "<div></div>" },
          SidebarLeftContent: { template: "<div></div>", props: ["logoUrl", "name", "sidebarType"] },
          SidebarLeftFilter: { template: "<div></div>", props: ["sidebarType"] },
          SidebarLeftFooter: { template: "<div></div>", props: ["sidebarContentScrollable"] },
          Icon: { template: "<span></span>", props: ["name", "size"] },
        },
      },
    });

    const searchBar = screen.getByTestId("search-bar");
    expect(searchBar).toBeDefined();
  });

  it("renderiza SidebarLeftMainSectionSelectors", async () => {
    await render(SidebarLeft, {
      global: {
        stubs: {
          SidebarLeftHeader: { template: "<div></div>" },
          SearchBar: { template: "<div></div>", props: ["modelValue", "location"], emits: ["update:modelValue"] },
          SidebarLeftMainSectionSelectors: {
            template: "<div data-testid='main-selectors'></div>",
          },
          SidebarLeftContent: { template: "<div></div>", props: ["logoUrl", "name", "sidebarType"] },
          SidebarLeftFilter: { template: "<div></div>", props: ["sidebarType"] },
          SidebarLeftFooter: { template: "<div></div>", props: ["sidebarContentScrollable"] },
          Icon: { template: "<span></span>", props: ["name", "size"] },
        },
      },
    });

    const selectors = screen.getByTestId("main-selectors");
    expect(selectors).toBeDefined();
  });

  it("renderiza SidebarLeftFooter", async () => {
    await render(SidebarLeft, {
      global: {
        stubs: {
          SidebarLeftHeader: { template: "<div></div>" },
          SearchBar: { template: "<div></div>", props: ["modelValue", "location"], emits: ["update:modelValue"] },
          SidebarLeftMainSectionSelectors: { template: "<div></div>" },
          SidebarLeftContent: { template: "<div></div>", props: ["logoUrl", "name", "sidebarType"] },
          SidebarLeftFilter: { template: "<div></div>", props: ["sidebarType"] },
          SidebarLeftFooter: {
            template: "<div data-testid='sidebar-footer'></div>",
            props: ["sidebarContentScrollable"],
          },
          Icon: { template: "<span></span>", props: ["name", "size"] },
        },
      },
    });

    const footer = screen.getByTestId("sidebar-footer");
    expect(footer).toBeDefined();
  });

  it("tem tabindex 0 para acessibilidade", async () => {
    const { container } = await render(SidebarLeft, {
      global: {
        stubs: {
          SidebarLeftHeader: { template: "<div></div>" },
          SearchBar: { template: "<div></div>", props: ["modelValue", "location"], emits: ["update:modelValue"] },
          SidebarLeftMainSectionSelectors: { template: "<div></div>" },
          SidebarLeftContent: { template: "<div></div>", props: ["logoUrl", "name", "sidebarType"] },
          SidebarLeftFilter: { template: "<div></div>", props: ["sidebarType"] },
          SidebarLeftFooter: { template: "<div></div>", props: ["sidebarContentScrollable"] },
          Icon: { template: "<span></span>", props: ["name", "size"] },
        },
      },
    });

    const sidebar = container.querySelector("#sidebar-left");
    expect(sidebar?.getAttribute("tabindex")).toBe("0");
  });

  it("tem border-r para separação visual", async () => {
    const { container } = await render(SidebarLeft, {
      global: {
        stubs: {
          SidebarLeftHeader: { template: "<div></div>" },
          SearchBar: { template: "<div></div>", props: ["modelValue", "location"], emits: ["update:modelValue"] },
          SidebarLeftMainSectionSelectors: { template: "<div></div>" },
          SidebarLeftContent: { template: "<div></div>", props: ["logoUrl", "name", "sidebarType"] },
          SidebarLeftFilter: { template: "<div></div>", props: ["sidebarType"] },
          SidebarLeftFooter: { template: "<div></div>", props: ["sidebarContentScrollable"] },
          Icon: { template: "<span></span>", props: ["name", "size"] },
        },
      },
    });

    const sidebar = container.querySelector("#sidebar-left");
    expect(sidebar?.className).toContain("border-r");
  });

  it("tem transition-all para animações suaves", async () => {
    const { container } = await render(SidebarLeft, {
      global: {
        stubs: {
          SidebarLeftHeader: { template: "<div></div>" },
          SearchBar: { template: "<div></div>", props: ["modelValue", "location"], emits: ["update:modelValue"] },
          SidebarLeftMainSectionSelectors: { template: "<div></div>" },
          SidebarLeftContent: { template: "<div></div>", props: ["logoUrl", "name", "sidebarType"] },
          SidebarLeftFilter: { template: "<div></div>", props: ["sidebarType"] },
          SidebarLeftFooter: { template: "<div></div>", props: ["sidebarContentScrollable"] },
          Icon: { template: "<span></span>", props: ["name", "size"] },
        },
      },
    });

    const sidebar = container.querySelector("#sidebar-left");
    expect(sidebar?.className).toContain("transition-all");
  });

  it("tem z-40 para stacking context", async () => {
    const { container } = await render(SidebarLeft, {
      global: {
        stubs: {
          SidebarLeftHeader: { template: "<div></div>" },
          SearchBar: { template: "<div></div>", props: ["modelValue", "location"], emits: ["update:modelValue"] },
          SidebarLeftMainSectionSelectors: { template: "<div></div>" },
          SidebarLeftContent: { template: "<div></div>", props: ["logoUrl", "name", "sidebarType"] },
          SidebarLeftFilter: { template: "<div></div>", props: ["sidebarType"] },
          SidebarLeftFooter: { template: "<div></div>", props: ["sidebarContentScrollable"] },
          Icon: { template: "<span></span>", props: ["name", "size"] },
        },
      },
    });

    const sidebar = container.querySelector("#sidebar-left");
    expect(sidebar?.className).toContain("z-40");
  });

  it("renderiza com background layer-1", async () => {
    const { container } = await render(SidebarLeft, {
      global: {
        stubs: {
          SidebarLeftHeader: { template: "<div></div>" },
          SearchBar: { template: "<div></div>", props: ["modelValue", "location"], emits: ["update:modelValue"] },
          SidebarLeftMainSectionSelectors: { template: "<div></div>" },
          SidebarLeftContent: { template: "<div></div>", props: ["logoUrl", "name", "sidebarType"] },
          SidebarLeftFilter: { template: "<div></div>", props: ["sidebarType"] },
          SidebarLeftFooter: { template: "<div></div>", props: ["sidebarContentScrollable"] },
          Icon: { template: "<span></span>", props: ["name", "size"] },
        },
      },
    });

    const sidebar = container.querySelector("#sidebar-left");
    expect(sidebar?.className).toContain("bg-layer-1");
  });

  it("renderiza como aside element", async () => {
    const { container } = await render(SidebarLeft, {
      global: {
        stubs: {
          SidebarLeftHeader: { template: "<div></div>" },
          SearchBar: { template: "<div></div>", props: ["modelValue", "location"], emits: ["update:modelValue"] },
          SidebarLeftMainSectionSelectors: { template: "<div></div>" },
          SidebarLeftContent: { template: "<div></div>", props: ["logoUrl", "name", "sidebarType"] },
          SidebarLeftFilter: { template: "<div></div>", props: ["sidebarType"] },
          SidebarLeftFooter: { template: "<div></div>", props: ["sidebarContentScrollable"] },
          Icon: { template: "<span></span>", props: ["name", "size"] },
        },
      },
    });

    const aside = container.querySelector("aside");
    expect(aside).toBeDefined();
    expect(aside?.id).toBe("sidebar-left");
  });

  it("renderiza com flex-col para layout vertical", async () => {
    const { container } = await render(SidebarLeft, {
      global: {
        stubs: {
          SidebarLeftHeader: { template: "<div></div>" },
          SearchBar: { template: "<div></div>", props: ["modelValue", "location"], emits: ["update:modelValue"] },
          SidebarLeftMainSectionSelectors: { template: "<div></div>" },
          SidebarLeftContent: { template: "<div></div>", props: ["logoUrl", "name", "sidebarType"] },
          SidebarLeftFilter: { template: "<div></div>", props: ["sidebarType"] },
          SidebarLeftFooter: { template: "<div></div>", props: ["sidebarContentScrollable"] },
          Icon: { template: "<span></span>", props: ["name", "size"] },
        },
      },
    });

    const sidebar = container.querySelector("#sidebar-left");
    expect(sidebar?.className).toContain("flex-col");
  });

  it("renderiza com shadow effect", async () => {
    const { container } = await render(SidebarLeft, {
      global: {
        stubs: {
          SidebarLeftHeader: { template: "<div></div>" },
          SearchBar: { template: "<div></div>", props: ["modelValue", "location"], emits: ["update:modelValue"] },
          SidebarLeftMainSectionSelectors: { template: "<div></div>" },
          SidebarLeftContent: { template: "<div></div>", props: ["logoUrl", "name", "sidebarType"] },
          SidebarLeftFilter: { template: "<div></div>", props: ["sidebarType"] },
          SidebarLeftFooter: { template: "<div></div>", props: ["sidebarContentScrollable"] },
          Icon: { template: "<span></span>", props: ["name", "size"] },
        },
      },
    });

    const sidebar = container.querySelector("#sidebar-left");
    expect(sidebar?.className).toContain("elem-shadow-sm");
  });

  it("renderiza com focus-brand para acessibilidade", async () => {
    const { container } = await render(SidebarLeft, {
      global: {
        stubs: {
          SidebarLeftHeader: { template: "<div></div>" },
          SearchBar: { template: "<div></div>", props: ["modelValue", "location"], emits: ["update:modelValue"] },
          SidebarLeftMainSectionSelectors: { template: "<div></div>" },
          SidebarLeftContent: { template: "<div></div>", props: ["logoUrl", "name", "sidebarType"] },
          SidebarLeftFilter: { template: "<div></div>", props: ["sidebarType"] },
          SidebarLeftFooter: { template: "<div></div>", props: ["sidebarContentScrollable"] },
          Icon: { template: "<span></span>", props: ["name", "size"] },
        },
      },
    });

    const sidebar = container.querySelector("#sidebar-left");
    expect(sidebar?.className).toContain("focus-brand");
  });
});
