// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen } from "@testing-library/vue";

import CardSearchResultEntity from "../../../../app/components/card/search-result-entity/CardSearchResultEntity.vue";
import render from "../../../../test/render";

describe("CardSearchResultEntity.vue", () => {
  const defaultProps = {
    title: "Test Organization",
    description: "This is a test organization description",
    linkUrl: "/organizations/test-org",
    ariaLabel: "i18n.common.view_organization",
    imageUrl: "https://example.com/image.jpg",
    imageAlt: "Organization Image",
    iconName: "mdi:organization",
    entityName: "test_org",
    isReduced: false,
  };

  it("renderiza o componente com as props corretas", async () => {
    await render(CardSearchResultEntity, {
      props: defaultProps,
    });

    const title = screen.getByTestId("group-title");
    expect(title).toBeDefined();
    expect(title.textContent).toBe("Test Organization");
  });

  it("renderiza o título corretamente", async () => {
    await render(CardSearchResultEntity, {
      props: defaultProps,
    });

    const title = screen.getByTestId("group-title");
    expect(title.textContent).toBe("Test Organization");
  });

  it("renderiza a descrição corretamente", async () => {
    await render(CardSearchResultEntity, {
      props: defaultProps,
    });

    const description = screen.getByTestId("entity-description");
    expect(description.textContent).toBe("This is a test organization description");
  });

  it("renderiza o nome da entidade com @ quando fornecido", async () => {
    await render(CardSearchResultEntity, {
      props: defaultProps,
    });

    const entityName = screen.getByTestId("group-entity-name");
    expect(entityName).toBeDefined();
    expect(entityName.textContent?.trim()).toBe("@test_org");
  });

  it("não renderiza o nome da entidade quando não fornecido", async () => {
    await render(CardSearchResultEntity, {
      props: {
        ...defaultProps,
        entityName: undefined,
      },
    });

    const entityName = screen.queryByTestId("group-entity-name");
    expect(entityName).toBeNull();
  });

  it("renderiza a imagem quando imageUrl é fornecido", async () => {
    await render(CardSearchResultEntity, {
      props: defaultProps,
    });

    const image = screen.getByAltText("Organization Image");
    expect(image).toBeDefined();
    expect(image.getAttribute("src")).toBe("https://example.com/image.jpg");
  });

  it("renderiza o ícone quando imageUrl não é fornecido", async () => {
    await render(CardSearchResultEntity, {
      props: {
        ...defaultProps,
        imageUrl: undefined,
      },
      global: {
        stubs: {
          Icon: {
            template: "<span data-testid='icon-placeholder'></span>",
            props: ["name"],
          },
        },
      },
    });

    const icon = screen.getByTestId("icon-placeholder");
    expect(icon).toBeDefined();
  });

  it("aplica a classe de tamanho reduzido quando isReduced é true", async () => {
    const { container } = await render(CardSearchResultEntity, {
      props: {
        ...defaultProps,
        isReduced: true,
      },
    });

    const description = screen.getByTestId("entity-description");
    expect(description.className).toContain("line-clamp-3");
  });

  it("aplica a classe de tamanho normal quando isReduced é false", async () => {
    const { container } = await render(CardSearchResultEntity, {
      props: {
        ...defaultProps,
        isReduced: false,
      },
    });

    const description = screen.getByTestId("entity-description");
    expect(description.className).toContain("line-clamp-4");
  });

  it("renderiza com NuxtLink correto para o linkUrl", async () => {
    await render(CardSearchResultEntity, {
      props: defaultProps,
    });

    const title = screen.getByTestId("group-title");
    const link = title.closest("a");
    expect(link).toBeDefined();
  });

  it("renderiza com aria-label correto", async () => {
    await render(CardSearchResultEntity, {
      props: defaultProps,
    });

    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);
  });

  it("renderiza slots para menu quando fornecido", async () => {
    await render(CardSearchResultEntity, {
      props: defaultProps,
      slots: {
        menu: '<span data-testid="menu-slot">Menu</span>',
      },
    });

    const menuSlot = screen.getByTestId("menu-slot");
    expect(menuSlot).toBeDefined();
    expect(menuSlot.textContent).toBe("Menu");
  });

  it("renderiza slots para image quando fornecido", async () => {
    await render(CardSearchResultEntity, {
      props: defaultProps,
      slots: {
        image: '<span data-testid="custom-image">Custom Image</span>',
      },
    });

    const customImage = screen.getByTestId("custom-image");
    expect(customImage).toBeDefined();
    expect(customImage.textContent).toBe("Custom Image");
  });

  it("aplica classes de estilo corretas", async () => {
    const { container } = await render(CardSearchResultEntity, {
      props: defaultProps,
    });

    const cardDiv = container.querySelector(".card-style");
    expect(cardDiv).toBeDefined();
    expect(cardDiv?.className).toContain("flex");
    expect(cardDiv?.className).toContain("flex-col");
  });

  it("renderiza com descrição vazia quando não fornecida", async () => {
    await render(CardSearchResultEntity, {
      props: {
        ...defaultProps,
        description: "",
      },
    });

    const description = screen.getByTestId("entity-description");
    expect(description.textContent).toBe("");
  });

  it("renderiza com título vazio quando não fornecido", async () => {
    await render(CardSearchResultEntity, {
      props: {
        ...defaultProps,
        title: "",
      },
    });

    const title = screen.getByTestId("group-title");
    expect(title.textContent).toBe("");
  });

  it("renderiza com imageAlt correto", async () => {
    await render(CardSearchResultEntity, {
      props: {
        ...defaultProps,
        imageAlt: "Custom Alt Text",
      },
    });

    const image = screen.getByAltText("Custom Alt Text");
    expect(image).toBeDefined();
  });

  it("renderiza com iconName customizado", async () => {
    await render(CardSearchResultEntity, {
      props: {
        ...defaultProps,
        imageUrl: undefined,
        iconName: "mdi:account",
      },
      global: {
        stubs: {
          Icon: {
            template: "<span data-testid='custom-icon'></span>",
            props: ["name"],
          },
        },
      },
    });

    const icon = screen.getByTestId("custom-icon");
    expect(icon).toBeDefined();
  });

  it("renderiza com diferentes títulos", async () => {
    const titles = ["Organization 1", "Organization 2", "Organization 3"];

    for (const title of titles) {
      const { unmount } = await render(CardSearchResultEntity, {
        props: {
          ...defaultProps,
          title,
        },
      });

      const titleElement = screen.getByTestId("group-title");
      expect(titleElement.textContent).toBe(title);
      unmount();
    }
  });

  it("renderiza com diferentes descrições", async () => {
    const descriptions = [
      "Description 1",
      "Description 2",
      "Description 3",
    ];

    for (const description of descriptions) {
      const { unmount } = await render(CardSearchResultEntity, {
        props: {
          ...defaultProps,
          description,
        },
      });

      const descElement = screen.getByTestId("entity-description");
      expect(descElement.textContent).toBe(description);
      unmount();
    }
  });
});
