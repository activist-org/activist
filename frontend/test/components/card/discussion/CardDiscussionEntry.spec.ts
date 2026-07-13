// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import type { DiscussionEntry } from "../../../../shared/types/discussion";

import CardDiscussionEntry from "../../../../app/components/card/discussion/CardDiscussionEntry.vue";
import { getEnglishText } from "../../../../shared/utils/i18n";
import render from "../../../render";

function createEntry(overrides: Partial<DiscussionEntry> = {}): DiscussionEntry {
  return {
    id: 1,
    author: "activist42",
    content: "I think this is a great idea!",
    votes: 3,
    date: new Date("2024-01-01T00:00:00Z"),
    ...overrides,
  };
}

describe("CardDiscussionEntry", () => {
  it("renders the author and content", async () => {
    await render(CardDiscussionEntry, {
      props: { discussionEntry: createEntry() },
    });

    expect(screen.getByText("activist42")).toBeTruthy();
    expect(screen.getByText("I think this is a great idea!")).toBeTruthy();
  });

  it("renders the formatted date preceded by 'on'", async () => {
    const date = new Date("2024-03-15T00:00:00Z");

    await render(CardDiscussionEntry, {
      props: { discussionEntry: createEntry({ date }) },
    });

    expect(
      screen.getByText(getEnglishText("i18n.components.card_discussion_entry.on"))
    ).toBeTruthy();
    expect(screen.getByText(date.toLocaleDateString())).toBeTruthy();
  });

  it("renders the vote count on the upvote button", async () => {
    await render(CardDiscussionEntry, {
      props: { discussionEntry: createEntry({ votes: 7 }) },
    });

    const button = screen.getByRole("button", {
      name: getEnglishText(
        "i18n.components.card.discussion._global.upvote_discussion_aria_label"
      ),
    });
    expect(button.textContent).toContain("7");
  });
});
