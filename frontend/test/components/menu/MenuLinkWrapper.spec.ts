// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/vue";

import MenuLinkWrapper from "../../../app/components/menu/MenuLinkWrapper.vue";
import render from "../../../test/render";

describe("MenuLinkWrapper.vue", () => {
  const defaultProps = {
    to: "/home",
    selected: false,
    isAddStyles: true,
  };

  it("renderiza o componente com as props corretas", async () => {
    await render(MenuLinkWrapper, {
      props: defaultProps,
      slots: {
        default: "Menu Link",
      },
    });

    const link = screen.getByRole("link");
    expect(link).toBeDefined();
  });

  it("renderiza como NuxtLink", async () => {
    await render(MenuLinkWrapper, {
      props: defaultProps,
      slots: {
        default: "Menu Link",
      },
    });

    const link = screen.getByRole("link");
    expect(link).toBeDefined();
  });

  it("renderiza o slot content", async () => {
    await render(MenuLinkWrapper, {
      props: defaultProps,
      slots: {
        default: "Test Menu Link",
      },
    });

    const content = screen.getByText("Test Menu Link");
    expect(content).toBeDefined();
  });

  it("aplica classe style-menu-option-cta quando selected é true", async () => {
    await render(MenuLinkWrapper, {
      props: {
        ...defaultProps,
        selected: true,
      },
      slots: {
        default: "Menu Link",
      },
    });

    const link = screen.getByRole("link");
    expect(link.className).toContain("style-menu-option-cta");
  });

  it("aplica classe style-menu-option quando selected é false e isAddStyles é true", async () => {
    await render(MenuLinkWrapper, {
      props: {
        ...defaultProps,
        selected: false,
        isAddStyles: true,
      },
      slots: {
        default: "Menu Link",
      },
    });

    const link = screen.getByRole("link");
    expect(link.className).toContain("style-menu-option");
  });

  it("aplica classe p-2 quando isAddStyles é true", async () => {
    await render(MenuLinkWrapper, {
      props: {
        ...defaultProps,
        isAddStyles: true,
      },
      slots: {
        default: "Menu Link",
      },
    });

    const link = screen.getByRole("link");
    expect(link.className).toContain("p-2");
  });

  it("não aplica classe p-2 quando isAddStyles é false", async () => {
    await render(MenuLinkWrapper, {
      props: {
        ...defaultProps,
        isAddStyles: false,
      },
      slots: {
        default: "Menu Link",
      },
    });

    const link = screen.getByRole("link");
    expect(link.className).not.toContain("p-2");
  });

  it("aplica classes base corretas", async () => {
    await render(MenuLinkWrapper, {
      props: defaultProps,
      slots: {
        default: "Menu Link",
      },
    });

    const link = screen.getByRole("link");
    expect(link.className).toContain("font-md");
    expect(link.className).toContain("group");
    expect(link.className).toContain("relative");
    expect(link.className).toContain("flex");
    expect(link.className).toContain("w-full");
    expect(link.className).toContain("items-center");
    expect(link.className).toContain("justify-center");
    expect(link.className).toContain("rounded-md");
    expect(link.className).toContain("text-left");
    expect(link.className).toContain("text-sm");
    expect(link.className).toContain("transition");
    expect(link.className).toContain("duration-200");
    expect(link.className).toContain("focus-brand");
  });

  it("renderiza com diferentes links", async () => {
    const links = ["/home", "/about", "/contact"];

    for (const link of links) {
      const { unmount } = await render(MenuLinkWrapper, {
        props: {
          ...defaultProps,
          to: link,
        },
        slots: {
          default: `Link to ${link}`,
        },
      });

      const content = screen.getByText(`Link to ${link}`);
      expect(content).toBeDefined();
      unmount();
    }
  });

  it("renderiza com selected e unselected states", async () => {
    const states = [true, false];

    for (const selected of states) {
      const { unmount } = await render(MenuLinkWrapper, {
        props: {
          ...defaultProps,
          selected,
        },
        slots: {
          default: "Menu Link",
        },
      });

      const link = screen.getByRole("link");
      if (selected) {
        expect(link.className).toContain("style-menu-option-cta");
      } else {
        expect(link.className).toContain("style-menu-option");
      }
      unmount();
    }
  });

  it("aplica classe basis-full", async () => {
    await render(MenuLinkWrapper, {
      props: defaultProps,
      slots: {
        default: "Menu Link",
      },
    });

    const link = screen.getByRole("link");
    expect(link.className).toContain("basis-full");
  });

  it("renderiza com slot content vazio", async () => {
    await render(MenuLinkWrapper, {
      props: defaultProps,
      slots: {
        default: "",
      },
    });

    const link = screen.getByRole("link");
    expect(link).toBeDefined();
  });

  it("isAddStyles tem valor padrão true", async () => {
    await render(MenuLinkWrapper, {
      props: {
        to: "/home",
        selected: false,
      },
      slots: {
        default: "Menu Link",
      },
    });

    const link = screen.getByRole("link");
    expect(link.className).toContain("p-2");
  });

  it("renderiza com diferentes combinações de props", async () => {
    const combinations = [
      { selected: true, isAddStyles: true },
      { selected: true, isAddStyles: false },
      { selected: false, isAddStyles: true },
      { selected: false, isAddStyles: false },
    ];

    for (const combo of combinations) {
      const { unmount } = await render(MenuLinkWrapper, {
        props: {
          ...defaultProps,
          ...combo,
        },
        slots: {
          default: "Menu Link",
        },
      });

      const link = screen.getByRole("link");
      expect(link).toBeDefined();
      unmount();
    }
  });
});
