// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from "vitest";

import Discussion from "../../../app/components/discussion/Discussion.vue";
import { createMockOrganization } from "../../mocks/factories";
import render from "../../render";

describe("Discussion", () => {
  it("renders the discussion input when organizations and discussionInput are provided", async () => {
    const { container } = await render(Discussion, {
      props: {
        organizations: [createMockOrganization()],
        discussionInput: {
          name: "Test",
          supporters: 0,
          description: "",
          category: "General",
          highRisk: false,
        },
      },
    });

    expect(container.querySelector("textarea")).toBeTruthy();
  });

  it("does not render the discussion input when organizations is missing", async () => {
    const { container } = await render(Discussion, {
      props: {
        discussionInput: {
          name: "Test",
          supporters: 0,
          description: "",
          category: "General",
          highRisk: false,
        },
      },
    });

    expect(container.querySelector("textarea")).toBeNull();
  });

  it("does not render the discussion input when discussionInput is missing", async () => {
    const { container } = await render(Discussion, {
      props: { organizations: [createMockOrganization()] },
    });

    expect(container.querySelector("textarea")).toBeNull();
  });
});
