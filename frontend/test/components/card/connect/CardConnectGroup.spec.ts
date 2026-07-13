// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import CardConnectGroup from "../../../../app/components/card/connect/CardConnectGroup.vue";
import {
  createMockGroup,
  createMockSocialLink,
} from "../../../mocks/factories";
import render from "../../../render";

describe("CardConnectGroup", () => {
  it("renders the group's social links", async () => {
    const group = createMockGroup({
      socialLinks: [
        createMockSocialLink({ link: "https://example.com", label: "Site" }),
      ],
    });

    await render(CardConnectGroup, {
      props: { group },
    });

    expect(screen.getByText("Site")).toBeTruthy();
  });

  it("renders no social links when the group is null", async () => {
    const { container } = await render(CardConnectGroup, {
      props: { group: null },
    });

    expect(
      container.querySelectorAll("[data-testid='social-link']").length
    ).toBe(0);
  });
});
