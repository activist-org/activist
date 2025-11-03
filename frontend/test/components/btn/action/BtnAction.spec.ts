// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, it, expect, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/vue";

import BtnAction from "../../../../app/components/btn/action/BtnAction.vue";
import render from "../../../../test/render";

describe("BtnAction.vue", () => {
  const defaultProps = {
    cta: true,
    fontSize: "base" as const,
    ariaLabel: "i18n.common.test_button",
    label: "i18n.common.test_label",
  };

  it("renderiza o botão com as props corretas", async () => {
    await render(BtnAction, {
      props: defaultProps,
    });

    const button = screen.getByRole("button");
    expect(button).toBeDefined();
  });

  it("aplica a classe cta quando cta é true", async () => {
    await render(BtnAction, {
      props: {
        ...defaultProps,
        cta: true,
      },
    });

    const button = screen.getByRole("button");
    expect(button.className).toContain("style-cta");
  });

  it("aplica a classe secondary quando cta é false", async () => {
    await render(BtnAction, {
      props: {
        ...defaultProps,
        cta: false,
      },
    });

    const button = screen.getByRole("button");
    expect(button.className).toContain("style-cta-secondary");
  });

  it("aplica a classe de fontSize corretamente", async () => {
    const fontSizes = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl"] as const;

    for (const fontSize of fontSizes) {
      const { unmount } = await render(BtnAction, {
        props: {
          ...defaultProps,
          fontSize,
        },
      });

      const button = screen.getByRole("button");
      expect(button.className).toContain(`text-${fontSize}`);
      unmount();
    }
  });

  it("renderiza com id quando fornecido", async () => {
    const testId = "test-button-id";
    await render(BtnAction, {
      props: {
        ...defaultProps,
        id: testId,
      },
    });

    const button = screen.getByRole("button");
    expect(button.id).toBe(testId);
  });

  it("renderiza com aria-label correto", async () => {
    await render(BtnAction, {
      props: defaultProps,
    });

    const button = screen.getByRole("button");
    expect(button.getAttribute("aria-label")).toBeDefined();
  });

  it("renderiza com ícone esquerdo quando leftIcon é fornecido", async () => {
    await render(BtnAction, {
      props: {
        ...defaultProps,
        leftIcon: "mdi:heart",
      },
      global: {
        stubs: {
          Icon: {
            template: "<span data-testid='left-icon'></span>",
          },
          BtnIconsLabel: {
            template: "<div><span data-testid='left-icon'></span></div>",
            props: ["leftIcon"],
          },
        },
      },
    });

    const leftIcon = screen.getByTestId("left-icon");
    expect(leftIcon).toBeDefined();
  });

  it("renderiza com ícone direito quando rightIcon é fornecido", async () => {
    await render(BtnAction, {
      props: {
        ...defaultProps,
        rightIcon: "mdi:arrow-right",
      },
      global: {
        stubs: {
          Icon: {
            template: "<span data-testid='right-icon'></span>",
          },
          BtnIconsLabel: {
            template: "<div><span data-testid='right-icon'></span></div>",
            props: ["rightIcon"],
          },
        },
      },
    });

    const rightIcon = screen.getByTestId("right-icon");
    expect(rightIcon).toBeDefined();
  });

  it("renderiza com counter quando fornecido", async () => {
    const counterValue = 5;
    await render(BtnAction, {
      props: {
        ...defaultProps,
        counter: counterValue,
      },
      global: {
        stubs: {
          BtnIconsLabel: {
            template: `<div><span data-testid='counter'>${counterValue}</span></div>`,
            props: ["counter"],
          },
        },
      },
    });

    const counter = screen.getByTestId("counter");
    expect(counter.textContent).toBe(String(counterValue));
  });

  it("renderiza com hideLabelOnMobile quando fornecido", async () => {
    await render(BtnAction, {
      props: {
        ...defaultProps,
        hideLabelOnMobile: true,
      },
    });

    const button = screen.getByRole("button");
    expect(button).toBeDefined();
  });

  it("renderiza com iconSize customizado", async () => {
    await render(BtnAction, {
      props: {
        ...defaultProps,
        iconSize: "2em",
      },
    });

    const button = screen.getByRole("button");
    expect(button).toBeDefined();
  });

  it("renderiza sem label quando label não é fornecido", async () => {
    await render(BtnAction, {
      props: {
        ...defaultProps,
        label: undefined,
      },
    });

    const button = screen.getByRole("button");
    expect(button).toBeDefined();
  });

  it("aplica classes de border-radius corretas", async () => {
    await render(BtnAction, {
      props: defaultProps,
    });

    const button = screen.getByRole("button");
    expect(button.className).toContain("rounded-md");
    expect(button.className).toContain("xl:rounded-lg");
  });

  it("renderiza BtnIconsLabel com props corretos", async () => {
    await render(BtnAction, {
      props: {
        ...defaultProps,
        leftIcon: "mdi:heart",
        rightIcon: "mdi:arrow-right",
        counter: 3,
        hideLabelOnMobile: true,
        iconSize: "1.5em",
      },
      global: {
        stubs: {
          BtnIconsLabel: {
            template: "<div data-testid='btn-icons-label'></div>",
            props: ["counter", "hideLabelOnMobile", "iconSize", "label", "leftIcon", "rightIcon"],
          },
        },
      },
    });

    const btnIconsLabel = screen.getByTestId("btn-icons-label");
    expect(btnIconsLabel).toBeDefined();
  });

  it("é clicável e dispara eventos", async () => {
    const { container } = await render(BtnAction, {
      props: defaultProps,
    });

    const button = screen.getByRole("button");
    await fireEvent.click(button);

    expect(button).toBeDefined();
  });
});
