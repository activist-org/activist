// SPDX-License-Identifier: AGPL-3.0-or-later
import { fireEvent, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";

import CardOrgApplicationVote from "../../../app/components/card/CardOrgApplicationVote.vue";
import { getEnglishText } from "../../../shared/utils/i18n";
import {
  createMockContentImage,
  createMockOrganization,
} from "../../mocks/factories";
import render from "../../render";

describe("CardOrgApplicationVote", () => {
  it("renders the title", async () => {
    await render(CardOrgApplicationVote, {
      props: {
        title: "Pending applications",
        organizations: [],
        upVotes: 0,
        downVotes: 0,
      },
    });

    expect(screen.getByText("Pending applications")).toBeTruthy();
  });

  it("renders a fallback icon for organizations without a logo", async () => {
    const organization = createMockOrganization({ iconUrl: undefined });

    await render(CardOrgApplicationVote, {
      props: {
        title: "Pending applications",
        organizations: [organization],
        upVotes: 0,
        downVotes: 0,
      },
    });

    expect(
      screen.getByRole("img", { name: "IconOrganization" })
    ).toBeTruthy();
  });

  it("renders the organization logo when iconUrl is present", async () => {
    const organization = createMockOrganization({
      name: "Test Org",
      iconUrl: createMockContentImage(),
    });

    const { container } = await render(CardOrgApplicationVote, {
      props: {
        title: "Pending applications",
        organizations: [organization],
        upVotes: 0,
        downVotes: 0,
      },
    });

    const img = container.querySelector("img[src='/test/image.png']");
    expect(img).toBeTruthy();
  });

  it("renders the up-vote and down-vote counters", async () => {
    await render(CardOrgApplicationVote, {
      props: {
        title: "Pending applications",
        organizations: [],
        upVotes: 3,
        downVotes: 1,
      },
    });

    expect(screen.getByText("3")).toBeTruthy();
    expect(screen.getByText("1")).toBeTruthy();
  });

  it("disables voting buttons by default", async () => {
    await render(CardOrgApplicationVote, {
      props: {
        title: "Pending applications",
        organizations: [],
        upVotes: 0,
        downVotes: 0,
      },
    });

    const upVoteButton = screen.getByRole("button", {
      name: getEnglishText(
        "i18n.components._global.upvote_application_aria_label"
      ),
    });
    expect(upVoteButton.hasAttribute("disabled")).toBe(true);
  });

  it("emits up-vote and down-vote when enabled and clicked", async () => {
    const { emitted } = await render(CardOrgApplicationVote, {
      props: {
        title: "Pending applications",
        organizations: [],
        upVotes: 0,
        downVotes: 0,
        isVotingDisabled: false,
      },
    });

    const upVoteButton = screen.getByRole("button", {
      name: getEnglishText(
        "i18n.components._global.upvote_application_aria_label"
      ),
    });
    const downVoteButton = screen.getByRole("button", {
      name: getEnglishText(
        "i18n.components.card_org_application_vote.downvote_application_aria_label"
      ),
    });

    await fireEvent.click(upVoteButton);
    await fireEvent.click(downVoteButton);

    expect(emitted()["up-vote"]).toBeTruthy();
    expect(emitted()["down-vote"]).toBeTruthy();
  });
});
