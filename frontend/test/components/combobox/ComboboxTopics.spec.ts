// SPDX-License-Identifier: AGPL-3.0-or-later
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { fireEvent, screen } from "@testing-library/vue";
import { describe, expect, it, vi } from "vitest";

import ComboboxTopics from "../../../app/components/combobox/ComboboxTopics.vue";
import { TopicEnum } from "../../../shared/types/topics";
import { getEnglishText } from "../../../shared/utils/i18n";
import { createMockTopic } from "../../mocks/factories";
import render from "../../render";

const { topicsData } = vi.hoisted(() => ({
  topicsData: {
    value: [
      { type: "ENVIRONMENT", id: "topic-1" },
      { type: "ANIMAL_RIGHTS", id: "topic-2" },
    ],
  },
}));

mockNuxtImport("useGetTopics", async () => {
  const { ref } = await import("vue");
  return () => ({
    data: ref(
      topicsData.value.map((t) =>
        createMockTopic({ type: t.type as TopicEnum, id: t.id })
      )
    ),
  });
});

async function openDropdown() {
  const toggleButton = screen.getByRole("button", {
    name: getEnglishText("i18n.components.combobox_topics.toggle_dropdown"),
  });
  await fireEvent.click(toggleButton);
}

describe("ComboboxTopics", () => {
  it("renders the combobox input with the filter placeholder and aria-label", async () => {
    await render(ComboboxTopics);

    const input = screen.getByRole("combobox");
    expect(input.getAttribute("aria-label")).toBe(
      getEnglishText("i18n.components.combobox_topics.filter_by_topic")
    );
    expect(input.getAttribute("placeholder")).toBe(
      getEnglishText("i18n.components.combobox_topics.filter_by_topic")
    );
  });

  it("shows the available topic options when the dropdown is opened", async () => {
    await render(ComboboxTopics);

    await openDropdown();

    const options = screen.getAllByTestId("topics-dropdown-option");
    expect(options.length).toBe(2);
    expect(screen.getByText("Environment")).toBeTruthy();
    expect(screen.getByText("Animal Rights")).toBeTruthy();
  });

  it("emits update:selectedTopics with the topic value when an option is selected", async () => {
    const { emitted } = await render(ComboboxTopics);

    await openDropdown();
    // headlessui's ComboboxOption selects on mousedown, not click.
    await fireEvent.mouseDown(screen.getByText("Environment"));

    const events = emitted()["update:selectedTopics"];
    expect(events).toBeTruthy();
    expect(events!.at(-1)).toEqual([[TopicEnum.ENVIRONMENT]]);
  });

  it("shows the no-matching-topics message when the query does not match any topic", async () => {
    const { container } = await render(ComboboxTopics);

    await openDropdown();
    const input = container.querySelector("input")!;
    await fireEvent.update(input, "nonexistent-topic-query");

    expect(
      screen.getByText(
        getEnglishText("i18n.components.combobox_topics.no_matching_topics")
      )
    ).toBeTruthy();
    expect(screen.queryAllByTestId("topics-dropdown-option").length).toBe(0);
  });

  it("pre-selects topics passed in via receivedSelectedTopics", async () => {
    await render(ComboboxTopics, {
      props: { receivedSelectedTopics: [TopicEnum.ANIMAL_RIGHTS] },
    });

    await openDropdown();

    const options = screen.getAllByTestId("topics-dropdown-option");
    const selectedOption = options.find((option) =>
      option.textContent?.includes("Animal Rights")
    );
    expect(selectedOption?.getAttribute("aria-selected")).toBe("true");
  });
});
