// SPDX-License-Identifier: AGPL-3.0-or-later
import { fireEvent, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import CardTopicSelection from "../../../app/components/card/CardTopicSelection.vue";
import { TopicEnum } from "../../../shared/types/topics";
import { getEnglishText } from "../../../shared/utils/i18n";
import render from "../../render";

describe("CardTopicSelection", () => {
  it("renders the topics heading", async () => {
    await render(CardTopicSelection, {
      props: { modelValue: [], pageType: "organization" },
    });

    expect(
      screen.getByText(getEnglishText("i18n.components._global.topics"))
    ).toBeTruthy();
  });

  it.each([
    ["organization", "subtext_organization"],
    ["group", "subtext_group"],
    ["resource", "subtext_resource"],
  ] as const)(
    "renders the %s subtext for pageType %s",
    async (pageType, key) => {
      await render(CardTopicSelection, {
        props: { modelValue: [], pageType },
      });

      expect(
        screen.getByText(
          getEnglishText(`i18n.components.card_topic_selection.${key}`)
        )
      ).toBeTruthy();
    }
  );

  it("does not render a subtext for pageType event", async () => {
    await render(CardTopicSelection, {
      props: { modelValue: [], pageType: "event" },
    });

    expect(
      screen.queryByText(
        getEnglishText(
          "i18n.components.card_topic_selection.subtext_organization"
        )
      )
    ).toBeNull();
  });

  it("renders all global topics in the desktop list", async () => {
    const { container } = await render(CardTopicSelection, {
      props: { modelValue: [], pageType: "organization" },
    });

    expect(container.querySelectorAll(".topic").length).toBe(15);
  });

  it("emits update:modelValue with the topic added when an unselected topic is clicked", async () => {
    const { container, emitted } = await render(CardTopicSelection, {
      props: { modelValue: [], pageType: "organization" },
    });

    const firstTopic = container.querySelector(".topic");
    expect(firstTopic).toBeTruthy();

    await fireEvent.click(firstTopic!);

    const events = emitted()["update:modelValue"];
    expect(events).toBeTruthy();
    expect((events![0] as [TopicEnum[]])[0]).toHaveLength(1);
  });

  it("emits update:modelValue with the topic removed when a selected topic is clicked", async () => {
    const { container, emitted } = await render(CardTopicSelection, {
      props: {
        modelValue: [TopicEnum.ENVIRONMENT],
        pageType: "organization",
      },
    });

    // Selected topics are sorted first, so the first `.topic` is the selected one.
    const firstTopic = container.querySelector(".topic");
    expect(firstTopic).toBeTruthy();

    await fireEvent.click(firstTopic!);

    const events = emitted()["update:modelValue"];
    expect(events).toBeTruthy();
    expect((events![0] as [TopicEnum[]])[0]).toEqual([]);
  });

  it("shows the view-all-topics toggle and switches its label when clicked", async () => {
    await render(CardTopicSelection, {
      props: { modelValue: [], pageType: "organization" },
    });

    const toggleButton = screen.getByRole("button", {
      name: getEnglishText(
        "i18n.components.card_topic_selection.view_all_topics"
      ),
    });
    expect(toggleButton).toBeTruthy();

    await fireEvent.click(toggleButton);

    expect(
      screen.getByRole("button", {
        name: getEnglishText(
          "i18n.components.card_topic_selection.hide_all_topics"
        ),
      })
    ).toBeTruthy();
  });
});
