// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/vue";

import TooltipBase from "../../../app/components/tooltip/TooltipBase.vue";
import render from "../../../test/render";

describe("TooltipBase.vue", () => {
  it("renderiza o tooltip com as classes base corretas", async () => {
    const { container } = await render(TooltipBase);

    const tooltip = container.querySelector(".tooltip");
    expect(tooltip?.className).toContain("tooltip");
    expect(tooltip?.className).toContain("z-20");
    expect(tooltip?.className).toContain("flex");
    expect(tooltip?.className).toContain("flex-col");
    expect(tooltip?.className).toContain("space-y-1");
    expect(tooltip?.className).toContain("rounded");
    expect(tooltip?.className).toContain("bg-layer-1");
    expect(tooltip?.className).toContain("shadow-zinc-700");
  });

  it("renderiza com header quando fornecido", async () => {
    await render(TooltipBase, {
      props: {
        header: "Título do Tooltip",
      },
    });

    const header = screen.getByRole("heading", { level: 4 });
    expect(header.textContent).toBe("Título do Tooltip");
  });

  it("não renderiza header quando não fornecido", async () => {
    await render(TooltipBase);

    const headers = screen.queryAllByRole("heading", { level: 4 });
    expect(headers).toHaveLength(0);
  });

  it("renderiza com text quando fornecido", async () => {
    await render(TooltipBase, {
      props: {
        text: "Texto do tooltip",
      },
    });

    const paragraph = screen.getByText("Texto do tooltip");
    expect(paragraph).toBeDefined();
    expect(paragraph.className).toContain("text-left");
  });

  it("não renderiza text quando não fornecido", async () => {
    await render(TooltipBase);

    const paragraphs = screen.queryAllByRole("paragraph");
    expect(paragraphs).toHaveLength(0);
  });

  it("renderiza header e text juntos", async () => {
    await render(TooltipBase, {
      props: {
        header: "Título",
        text: "Descrição",
      },
    });

    const header = screen.getByRole("heading", { level: 4 });
    const text = screen.getByText("Descrição");

    expect(header.textContent).toBe("Título");
    expect(text.textContent).toBe("Descrição");
  });

  it("aplica classes corretas quando não tem slot default", async () => {
    const { container } = await render(TooltipBase, {
      props: {
        header: "Teste",
      },
    });

    const tooltip = container.querySelector(".tooltip");
    expect(tooltip?.className).toContain("w-max");
    expect(tooltip?.className).toContain("px-2");
    expect(tooltip?.className).toContain("py-1");
    expect(tooltip?.className).toContain("elem-shadow-sm");
  });

  it("aplica classes corretas quando tem slot default", async () => {
    const { container } = await render(TooltipBase, {
      props: {
        header: "Teste",
      },
      slots: {
        default: "<div>Conteúdo do slot</div>",
      },
    });

    const tooltip = container.querySelector(".tooltip");
    expect(tooltip?.className).toContain("w-min");
    expect(tooltip?.className).toContain("px-3");
    expect(tooltip?.className).toContain("py-2");
    expect(tooltip?.className).toContain("elem-shadow-md");
  });

  it("renderiza slot default quando fornecido", async () => {
    await render(TooltipBase, {
      slots: {
        default: "<span data-testid='slot-content'>Conteúdo customizado</span>",
      },
    });

    const slotContent = screen.getByTestId("slot-content");
    expect(slotContent.textContent).toBe("Conteúdo customizado");
  });

  it("renderiza header, text e slot juntos", async () => {
    await render(TooltipBase, {
      props: {
        header: "Título",
        text: "Descrição",
      },
      slots: {
        default: "<button data-testid='slot-button'>Ação</button>",
      },
    });

    const header = screen.getByRole("heading", { level: 4 });
    const text = screen.getByText("Descrição");
    const button = screen.getByTestId("slot-button");

    expect(header.textContent).toBe("Título");
    expect(text.textContent).toBe("Descrição");
    expect(button.textContent).toBe("Ação");
  });

  it("renderiza apenas header sem text", async () => {
    await render(TooltipBase, {
      props: {
        header: "Apenas Título",
      },
    });

    const header = screen.getByRole("heading", { level: 4 });
    expect(header.textContent).toBe("Apenas Título");

    const paragraphs = screen.queryAllByRole("paragraph");
    expect(paragraphs).toHaveLength(0);
  });

  it("renderiza apenas text sem header", async () => {
    await render(TooltipBase, {
      props: {
        text: "Apenas Texto",
      },
    });

    const text = screen.getByText("Apenas Texto");
    expect(text).toBeDefined();

    const headers = screen.queryAllByRole("heading", { level: 4 });
    expect(headers).toHaveLength(0);
  });

  it("renderiza vazio quando nenhuma prop é fornecida", async () => {
    const { container } = await render(TooltipBase);

    const tooltip = container.querySelector(".tooltip");
    expect(tooltip).toBeDefined();
    expect(tooltip?.children.length).toBe(0);
  });

  it("renderiza com null para header e text", async () => {
    const { container } = await render(TooltipBase, {
      props: {
        header: null,
        text: null,
      },
    });

    const tooltip = container.querySelector(".tooltip");
    expect(tooltip).toBeDefined();

    const headers = screen.queryAllByRole("heading", { level: 4 });
    const paragraphs = screen.queryAllByRole("paragraph");

    expect(headers).toHaveLength(0);
    expect(paragraphs).toHaveLength(0);
  });

  it("renderiza com múltiplos elementos no slot", async () => {
    await render(TooltipBase, {
      props: {
        header: "Tooltip com múltiplos elementos",
      },
      slots: {
        default: `
          <span data-testid='element-1'>Elemento 1</span>
          <span data-testid='element-2'>Elemento 2</span>
          <span data-testid='element-3'>Elemento 3</span>
        `,
      },
    });

    const element1 = screen.getByTestId("element-1");
    const element2 = screen.getByTestId("element-2");
    const element3 = screen.getByTestId("element-3");

    expect(element1.textContent).toBe("Elemento 1");
    expect(element2.textContent).toBe("Elemento 2");
    expect(element3.textContent).toBe("Elemento 3");
  });

  it("mantém a estrutura correta com todas as props", async () => {
    const { container } = await render(TooltipBase, {
      props: {
        header: "Cabeçalho",
        text: "Texto descritivo",
      },
      slots: {
        default: "<div data-testid='custom-slot'>Slot</div>",
      },
    });

    const tooltip = container.querySelector(".tooltip");
    const children = tooltip?.children;

    expect(children?.length).toBe(3); // h4, p, div
    expect(children?.[0].tagName).toBe("H4");
    expect(children?.[1].tagName).toBe("P");
    expect(children?.[2].getAttribute("data-testid")).toBe("custom-slot");
  });
});
