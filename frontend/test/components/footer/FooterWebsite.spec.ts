// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { beforeEach, describe, expect, it, vi } from "vitest";

import FooterWebsite from "../../../app/components/footer/FooterWebsite.vue";
import { getEnglishText } from "../../../shared/utils/i18n";
import render from "../../render";

beforeEach(() => {
  vi.stubGlobal("useLocalePath", () => (path: string) => path);
});

describe("FooterWebsite", () => {
  it("renders the tagline", async () => {
    await render(FooterWebsite);

    expect(
      screen.getByText(
        getEnglishText("i18n.components.footer_website.activist_tagline")
      )
    ).toBeTruthy();
  });

  it("renders the platform links, including the internal roadmap link", async () => {
    const { container } = await render(FooterWebsite);

    const sourceCodeLink = screen.getByRole("link", {
      name: getEnglishText(
        "i18n.components.footer_website.source_code_aria_label"
      ),
    });
    expect(sourceCodeLink.getAttribute("href")).toBe(
      "https://github.com/activist-org/activist"
    );

    const roadmapLink = screen.getByRole("link", {
      name: getEnglishText("i18n.components.footer_website.road_map_aria_label"),
    });
    expect(roadmapLink.getAttribute("href")).toBe(
      "https://docs.activist.org/activist/product/about/roadmap"
    );
    // Internal links go through localePath.
    expect(container.contains(roadmapLink)).toBe(true);
  });

  it("renders the connect links", async () => {
    await render(FooterWebsite);

    expect(
      screen.getByRole("link", {
        name: getEnglishText("i18n.components._global.github_aria_label"),
      })
    ).toBeTruthy();
    expect(
      screen.getByRole("link", {
        name: getEnglishText("i18n.components._global.matrix_aria_label"),
      })
    ).toBeTruthy();
    expect(
      screen.getByRole("link", {
        name: getEnglishText("i18n.components._global.instagram_aria_label"),
      })
    ).toBeTruthy();
  });

  it("renders the resources, organization, and legal links", async () => {
    await render(FooterWebsite);

    expect(
      screen.getByRole("link", {
        name: getEnglishText(
          "i18n.components.footer_website.documentation_aria_label"
        ),
      })
    ).toBeTruthy();
    expect(
      screen.getByRole("link", {
        name: getEnglishText("i18n.components.footer_website.about_aria_label"),
      })
    ).toBeTruthy();
    expect(
      screen.getByRole("link", {
        name: getEnglishText(
          "i18n.components.footer_website.trademark_policy_aria_label"
        ),
      })
    ).toBeTruthy();
    expect(
      screen.getByRole("link", {
        name: getEnglishText(
          "i18n.components.footer_website.privacy_policy_aria_label"
        ),
      })
    ).toBeTruthy();
  });

  it("renders the Netlify and copyright notices", async () => {
    await render(FooterWebsite);

    expect(
      screen.getByText(
        getEnglishText("i18n.components.footer_website.powered_by_netlify")
      )
    ).toBeTruthy();
    expect(
      screen.getByText(
        getEnglishText("i18n.components.footer_website.copyright")
      )
    ).toBeTruthy();
  });
});
