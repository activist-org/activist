// SPDX-License-Identifier: AGPL-3.0-or-later
import { screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import DiscussionHeader from "../../../app/components/discussion/DiscussionHeader.vue";
import { getEnglishText } from "../../../shared/utils/i18n";
import render from "../../render";

describe("DiscussionHeader", () => {
  it("renders the discussion header text", async () => {
    await render(DiscussionHeader);

    expect(
      screen.getByText(getEnglishText("i18n._global.discussion"))
    ).toBeTruthy();
  });
});
