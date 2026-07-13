// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import CardConnectOrganization from "../../../../app/components/card/connect/CardConnectOrganization.vue";
import {
  createMockOrganization,
  createMockSocialLink,
} from "../../../mocks/factories";
import render from "../../../render";

describe("CardConnectOrganization", () => {
  it("renders the organization's social links", async () => {
    const organization = createMockOrganization({
      socialLinks: [
        createMockSocialLink({ link: "https://example.com", label: "Site" }),
      ],
    });

    await render(CardConnectOrganization, {
      props: { organization },
    });

    expect(screen.getByText("Site")).toBeTruthy();
  });

  it("renders no social links when the organization is null", async () => {
    const { container } = await render(CardConnectOrganization, {
      props: { organization: null },
    });

    expect(
      container.querySelectorAll("[data-testid='social-link']").length
    ).toBe(0);
  });
});
