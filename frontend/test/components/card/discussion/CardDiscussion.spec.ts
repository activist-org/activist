// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import type { Discussion } from "../../../../shared/types/discussion";

import CardDiscussion from "../../../../app/components/card/discussion/CardDiscussion.vue";
import { getEnglishText } from "../../../../shared/utils/i18n";
import { createMockUser } from "../../../mocks/factories";
import render from "../../../render";

function createDiscussion(overrides: Partial<Discussion> = {}): Discussion {
  return {
    title: "Should we host a rally?",
    createdBy: createMockUser({ userName: "organizer1" }),
    category: "Planning",
    upVoters: [],
    participants: [],
    messages: 0,
    creationDate: "2024-01-01T00:00:00Z",
    ...overrides,
  };
}

describe("CardDiscussion", () => {
  it("renders the discussion title", async () => {
    await render(CardDiscussion, {
      props: { discussion: createDiscussion() },
    });

    expect(screen.getByText("Should we host a rally?")).toBeTruthy();
  });

  it("renders the discussion category on the filter button", async () => {
    await render(CardDiscussion, {
      props: { discussion: createDiscussion({ category: "Logistics" }) },
    });

    const button = screen.getByRole("button", {
      name: getEnglishText(
        "i18n.components.card_discussion.filter_discussion_category_aria_label"
      ),
    });
    expect(button.textContent).toContain("Logistics");
  });

  it("renders the participant count and message count meta tags", async () => {
    const discussion = createDiscussion({
      participants: [createMockUser(), createMockUser()],
      messages: 5,
    });

    const { container } = await render(CardDiscussion, {
      props: { discussion },
    });

    // Participants, message count, and the creation-date meta tags.
    const metaTags = container.querySelectorAll("[data-testid='meta-tag']");
    expect(metaTags.length).toBe(3);
    expect(screen.getByText("5")).toBeTruthy();
  });

  it("renders the discussion creator's username", async () => {
    const discussion = createDiscussion({
      createdBy: createMockUser({ userName: "activist42" }),
    });

    await render(CardDiscussion, { props: { discussion } });

    expect(screen.getByText("activist42")).toBeTruthy();
  });

  it("renders exactly one upvote button", async () => {
    await render(CardDiscussion, {
      props: { discussion: createDiscussion() },
    });

    const upvoteButtons = screen.getAllByRole("button", {
      name: getEnglishText(
        "i18n.components.card.discussion._global.upvote_discussion_aria_label"
      ),
    });
    expect(upvoteButtons.length).toBe(1);
  });
});
