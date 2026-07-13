// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import CardConnectEvent from "../../../../app/components/card/connect/CardConnectEvent.vue";
import {
  createMockEvent,
  createMockSocialLink,
} from "../../../mocks/factories";
import render from "../../../render";

describe("CardConnectEvent", () => {
  it("renders the event's social links", async () => {
    const event = createMockEvent({
      socialLinks: [
        createMockSocialLink({ link: "https://example.com", label: "Site" }),
      ],
    });

    await render(CardConnectEvent, {
      props: { event },
    });

    expect(screen.getByText("Site")).toBeTruthy();
  });

  it("renders no social links when the event is null", async () => {
    const { container } = await render(CardConnectEvent, {
      props: { event: null },
    });

    expect(
      container.querySelectorAll("[data-testid='social-link']").length
    ).toBe(0);
  });
});
