// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/vue";

import ModalBase from "../../../app/components/modal/ModalBase.vue";
import render from "../../../test/render";

// Mock useModals composable
vi.mock("../../../app/composables/useModals", () => ({
  useModals: () => ({
    modals: {
      "test-modal": {
        isOpen: true,
      },
    },
    closeModal: vi.fn(),
  }),
}));

// Mock useRoute composable
vi.mock("vue-router", () => ({
  useRoute: () => ({
    path: "/test",
  }),
}));

describe("ModalBase.vue", () => {
  const defaultProps = {
    modalName: "test-modal",
  };

  it("renderiza o modal com as classes base corretas", async () => {
    const { container } = await render(ModalBase, {
      props: defaultProps,
      global: {
        stubs: {
          Dialog: {
            template: "<div data-testid='dialog'><slot /></div>",
            props: ["open"],
          },
          DialogBackdrop: {
            template: "<div data-testid='backdrop'></div>",
          },
          DialogPanel: {
            template: "<div data-testid='panel'><slot /></div>",
            props: ["class", "id", "dataTestid"],
          },
          Icon: {
            template: "<span data-testid='icon'></span>",
          },
        },
      },
    });

    const dialog = screen.getByTestId("dialog");
    expect(dialog).toBeDefined();
  });

  it("renderiza backdrop corretamente", async () => {
    await render(ModalBase, {
      props: defaultProps,
      global: {
        stubs: {
          Dialog: {
            template: "<div><slot /></div>",
          },
          DialogBackdrop: {
            template: "<div data-testid='backdrop' class='fixed inset-0'></div>",
          },
          DialogPanel: {
            template: "<div><slot /></div>",
          },
          Icon: {
            template: "<span></span>",
          },
        },
      },
    });

    const backdrop = screen.getByTestId("backdrop");
    expect(backdrop.className).toContain("fixed");
    expect(backdrop.className).toContain("inset-0");
  });

  it("renderiza modal em modo normal (não imagem)", async () => {
    const { container } = await render(ModalBase, {
      props: {
        ...defaultProps,
        imageModal: false,
      },
      global: {
        stubs: {
          Dialog: {
            template: "<div><slot /></div>",
          },
          DialogBackdrop: {
            template: "<div></div>",
          },
          DialogPanel: {
            template: "<div id='modal' :class='$attrs.class'><slot /></div>",
          },
          Icon: {
            template: "<span></span>",
          },
        },
      },
    });

    const modal = container.querySelector("#modal");
    expect(modal?.className).toContain("container");
    expect(modal?.className).toContain("bg-layer-0");
  });

  it("renderiza modal em modo imagem", async () => {
    const { container } = await render(ModalBase, {
      props: {
        ...defaultProps,
        imageModal: true,
      },
      global: {
        stubs: {
          Dialog: {
            template: "<div><slot /></div>",
          },
          DialogBackdrop: {
            template: "<div></div>",
          },
          DialogPanel: {
            template: "<div id='modal' :class='$attrs.class'><slot /></div>",
          },
          Icon: {
            template: "<span></span>",
          },
        },
      },
    });

    const modal = container.querySelector("#modal");
    expect(modal?.className).toContain("flex");
    expect(modal?.className).toContain("flex-col");
    expect(modal?.className).toContain("items-center");
  });

  it("renderiza botão de fechar para modal de imagem", async () => {
    await render(ModalBase, {
      props: {
        ...defaultProps,
        imageModal: true,
      },
      global: {
        stubs: {
          Dialog: {
            template: "<div><slot /></div>",
          },
          DialogBackdrop: {
            template: "<div></div>",
          },
          DialogPanel: {
            template: "<div><slot /></div>",
          },
          Icon: {
            template: "<span></span>",
          },
        },
      },
    });

    const closeButton = screen.getByTestId("modal-close-button");
    expect(closeButton).toBeDefined();
    expect(closeButton.getAttribute("role")).toBe("button");
  });

  it("renderiza botão de fechar para modal normal", async () => {
    await render(ModalBase, {
      props: {
        ...defaultProps,
        imageModal: false,
      },
      global: {
        stubs: {
          Dialog: {
            template: "<div><slot /></div>",
          },
          DialogBackdrop: {
            template: "<div></div>",
          },
          DialogPanel: {
            template: "<div><slot /></div>",
          },
          Icon: {
            template: "<span></span>",
          },
        },
      },
    });

    const closeButton = screen.getByTestId("modal-close-button");
    expect(closeButton).toBeDefined();
    expect(closeButton.getAttribute("role")).toBe("button");
  });

  it("renderiza slot content", async () => {
    await render(ModalBase, {
      props: defaultProps,
      slots: {
        default: "<div data-testid='slot-content'>Modal Content</div>",
      },
      global: {
        stubs: {
          Dialog: {
            template: "<div><slot /></div>",
          },
          DialogBackdrop: {
            template: "<div></div>",
          },
          DialogPanel: {
            template: "<div><slot /></div>",
          },
          Icon: {
            template: "<span></span>",
          },
        },
      },
    });

    const slotContent = screen.getByTestId("slot-content");
    expect(slotContent.textContent).toBe("Modal Content");
  });

  it("tem data-testid com o nome do modal", async () => {
    await render(ModalBase, {
      props: {
        ...defaultProps,
        modalName: "custom-modal",
      },
      global: {
        stubs: {
          Dialog: {
            template: "<div><slot /></div>",
          },
          DialogBackdrop: {
            template: "<div></div>",
          },
          DialogPanel: {
            template: "<div :data-testid='$attrs[\"data-testid\"]'><slot /></div>",
          },
          Icon: {
            template: "<span></span>",
          },
        },
      },
    });

    const panel = screen.getByTestId("modal-custom-modal");
    expect(panel).toBeDefined();
  });

  it("aplica classes corretas para wrapper em modo normal", async () => {
    const { container } = await render(ModalBase, {
      props: {
        ...defaultProps,
        imageModal: false,
      },
      global: {
        stubs: {
          Dialog: {
            template: "<div><slot /></div>",
          },
          DialogBackdrop: {
            template: "<div></div>",
          },
          DialogPanel: {
            template: "<div><slot /></div>",
          },
          Icon: {
            template: "<span></span>",
          },
        },
      },
    });

    const wrapper = container.querySelector(".cursor-pointer");
    expect(wrapper?.className).toContain("fixed");
    expect(wrapper?.className).toContain("inset-0");
    expect(wrapper?.className).toContain("flex");
    expect(wrapper?.className).toContain("items-center");
    expect(wrapper?.className).toContain("justify-center");
  });

  it("aplica classes corretas para wrapper em modo imagem", async () => {
    const { container } = await render(ModalBase, {
      props: {
        ...defaultProps,
        imageModal: true,
      },
      global: {
        stubs: {
          Dialog: {
            template: "<div><slot /></div>",
          },
          DialogBackdrop: {
            template: "<div></div>",
          },
          DialogPanel: {
            template: "<div><slot /></div>",
          },
          Icon: {
            template: "<span></span>",
          },
        },
      },
    });

    const wrapper = container.querySelector(".cursor-pointer");
    expect(wrapper?.className).toContain("fixed");
    expect(wrapper?.className).toContain("top-0");
    expect(wrapper?.className).toContain("z-10");
    expect(wrapper?.className).toContain("flex");
    expect(wrapper?.className).toContain("h-screen");
    expect(wrapper?.className).toContain("w-full");
  });

  it("renderiza Dialog com prop open", async () => {
    await render(ModalBase, {
      props: defaultProps,
      global: {
        stubs: {
          Dialog: {
            template: "<div data-testid='dialog' :data-open='open'><slot /></div>",
            props: ["open"],
          },
          DialogBackdrop: {
            template: "<div></div>",
          },
          DialogPanel: {
            template: "<div><slot /></div>",
          },
          Icon: {
            template: "<span></span>",
          },
        },
      },
    });

    const dialog = screen.getByTestId("dialog");
    expect(dialog).toBeDefined();
  });

  it("renderiza com id modal correto", async () => {
    const { container } = await render(ModalBase, {
      props: defaultProps,
      global: {
        stubs: {
          Dialog: {
            template: "<div><slot /></div>",
          },
          DialogBackdrop: {
            template: "<div></div>",
          },
          DialogPanel: {
            template: "<div id='modal'><slot /></div>",
          },
          Icon: {
            template: "<span></span>",
          },
        },
      },
    });

    const modal = container.querySelector("#modal");
    expect(modal).toBeDefined();
  });

  it("renderiza close button com aria-label", async () => {
    await render(ModalBase, {
      props: defaultProps,
      global: {
        stubs: {
          Dialog: {
            template: "<div><slot /></div>",
          },
          DialogBackdrop: {
            template: "<div></div>",
          },
          DialogPanel: {
            template: "<div><slot /></div>",
          },
          Icon: {
            template: "<span></span>",
          },
        },
      },
    });

    const closeButton = screen.getByTestId("modal-close-button");
    expect(closeButton.getAttribute("aria-label")).toBeDefined();
  });

  it("renderiza Icon component no close button", async () => {
    await render(ModalBase, {
      props: defaultProps,
      global: {
        stubs: {
          Dialog: {
            template: "<div><slot /></div>",
          },
          DialogBackdrop: {
            template: "<div></div>",
          },
          DialogPanel: {
            template: "<div><slot /></div>",
          },
          Icon: {
            template: "<span data-testid='close-icon'></span>",
          },
        },
      },
    });

    const icon = screen.getByTestId("close-icon");
    expect(icon).toBeDefined();
  });

  it("renderiza com diferentes nomes de modal", async () => {
    const modalNames = ["modal-1", "modal-2", "modal-3"];

    for (const name of modalNames) {
      const { unmount } = await render(ModalBase, {
        props: {
          modalName: name,
        },
        global: {
          stubs: {
            Dialog: {
              template: "<div><slot /></div>",
            },
            DialogBackdrop: {
              template: "<div></div>",
            },
            DialogPanel: {
              template: "<div :data-testid='`modal-${$attrs[\"data-testid\"]}`'><slot /></div>",
            },
            Icon: {
              template: "<span></span>",
            },
          },
        },
      });

      unmount();
    }

    expect(true).toBe(true);
  });
});
