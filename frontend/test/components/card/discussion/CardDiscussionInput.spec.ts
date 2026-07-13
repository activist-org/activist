// SPDX-License-Identifier: AGPL-3.0-or-later
import { fireEvent, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import type { DiscussionInput } from "../../../../shared/types/discussion";

import CardDiscussionInput from "../../../../app/components/card/discussion/CardDiscussionInput.vue";
import { getEnglishText } from "../../../../shared/utils/i18n";
import render from "../../../render";

function createDiscussionInput(
  overrides: Partial<DiscussionInput> = {}
): DiscussionInput {
  return {
    name: "Test discussion",
    supporters: 0,
    description: "",
    category: "General",
    highRisk: false,
    ...overrides,
  };
}

describe("CardDiscussionInput", () => {
  it("renders the Write and Preview toggle buttons in markdown mode, with Write active", async () => {
    await render(CardDiscussionInput, {
      props: { discussionInput: createDiscussionInput() },
    });

    const writeButton = screen.getByRole("button", {
      name: getEnglishText(
        "i18n.components.card_discussion_input.write_aria_label"
      ),
    });
    const previewButton = screen.getByRole("button", {
      name: getEnglishText(
        "i18n.components.card_discussion_input.preview_aria_label"
      ),
    });

    expect(writeButton.className).toContain("style-cta ");
    expect(previewButton.className).toContain("style-cta-secondary");
  });

  it("switches the active toggle to Preview when clicked", async () => {
    await render(CardDiscussionInput, {
      props: { discussionInput: createDiscussionInput() },
    });

    const previewButton = screen.getByRole("button", {
      name: getEnglishText(
        "i18n.components.card_discussion_input.preview_aria_label"
      ),
    });
    await fireEvent.click(previewButton);

    const writeButton = screen.getByRole("button", {
      name: getEnglishText(
        "i18n.components.card_discussion_input.write_aria_label"
      ),
    });
    expect(previewButton.className).toContain("style-cta ");
    expect(writeButton.className).toContain("style-cta-secondary");
  });

  it("switches from the markdown toolbar to the plain-text formatting icons when markdown support is disabled", async () => {
    const { container } = await render(CardDiscussionInput, {
      props: { discussionInput: createDiscussionInput() },
    });

    expect(
      screen.getByRole("button", {
        name: getEnglishText(
          "i18n.components.card_discussion_input.write_aria_label"
        ),
      })
    ).toBeTruthy();

    const checkbox = container.querySelector("input[type='checkbox']")!;
    await fireEvent.click(checkbox);

    expect(
      screen.queryByRole("button", {
        name: getEnglishText(
          "i18n.components.card_discussion_input.write_aria_label"
        ),
      })
    ).toBeNull();
    expect(container.querySelector(".cursor-pointer")).toBeTruthy();
  });

  it("updates the textarea value when typed into", async () => {
    const { container } = await render(CardDiscussionInput, {
      props: { discussionInput: createDiscussionInput() },
    });

    const textarea = container.querySelector("textarea")!;
    await fireEvent.update(textarea, "Hello world");

    expect(textarea.value).toBe("Hello world");
  });

  it("renders the write textarea and preview editor for a normal-risk discussion", async () => {
    const { container } = await render(CardDiscussionInput, {
      props: { discussionInput: createDiscussionInput({ highRisk: false }) },
    });

    expect(container.querySelector("textarea")).toBeTruthy();
    expect(container.querySelector(".tiptap")).toBeTruthy();
  });

  it("shows the warning octagon icon when the discussion is high risk", async () => {
    await render(CardDiscussionInput, {
      props: { discussionInput: createDiscussionInput({ highRisk: true }) },
    });

    expect(
      screen.getByRole("img", { name: "bi:exclamation-octagon" })
    ).toBeTruthy();
  });

  it("shows the warning triangle icon when the discussion is not high risk", async () => {
    await render(CardDiscussionInput, {
      props: { discussionInput: createDiscussionInput({ highRisk: false }) },
    });

    expect(
      screen.getByRole("img", { name: "bi:exclamation-triangle" })
    ).toBeTruthy();
  });

  it("renders the comment button", async () => {
    await render(CardDiscussionInput, {
      props: { discussionInput: createDiscussionInput() },
    });

    const button = screen.getByRole("button", {
      name: getEnglishText(
        "i18n.components.card_discussion_input.comment_aria_label"
      ),
    });
    expect(button.textContent).toContain(
      getEnglishText("i18n.components.card_discussion_input.comment")
    );
  });
});
