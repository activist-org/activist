// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from "vitest";

import type { SocialLinkFormData } from "../../../shared/types/social-link";

import {
  createEventSocialLinks,
  deleteEventSocialLink,
  replaceAllEventSocialLinks,
  updateEventSocialLink,
} from "../../../app/services/event/social-link";
import { AppError } from "../../../shared/utils/errorHandler";
import {
  expectJsonRequest,
  expectRequest,
  setupServiceTestMocks,
} from "../helpers";

describe("services/event/social-link", () => {
  const getMocks = setupServiceTestMocks();

  it("createEventSocialLinks() POSTs each link with event", async () => {
    const { post } = getMocks();
    post.mockResolvedValue({ ok: true });
    const links: SocialLinkFormData[] = [
      { link: "https://x", label: "x", order: 0 },
    ] as unknown as SocialLinkFormData[];
    await createEventSocialLinks("evt-1", links);
    expect(post).toHaveBeenCalledTimes(1);
    expectJsonRequest(post, "/events/event_social_links", "POST", {
      link: "https://x",
      label: "x",
      order: 0,
      event: "evt-1",
    });
  });

  // MARK: Update

  it("updateEventSocialLink() PUTs JSON with event", async () => {
    const { put } = getMocks();
    put.mockResolvedValueOnce({ ok: true });
    await updateEventSocialLink("evt-2", "sl-1", {
      link: "https://z",
      label: "z",
      order: 2,
    });
    expectJsonRequest(put, "/events/event_social_links/sl-1", "PUT", {
      link: "https://z",
      label: "z",
      order: 2,
      event: "evt-2",
    });
  });

  it("deleteEventSocialLink() issues DELETE", async () => {
    const { del } = getMocks();
    del.mockResolvedValueOnce({ ok: true });
    await deleteEventSocialLink("sl-2");
    expectRequest(del, "/events/event_social_links/sl-2", "DELETE");
  });

  it("replaceAllEventSocialLinks() DELETEs then recreates", async () => {
    const { del } = getMocks();
    del.mockResolvedValue({ ok: true });
    await replaceAllEventSocialLinks("evt-3", [
      { link: "https://a", label: "a", order: 0 },
    ]);
    expectJsonRequest(del, "/events/event_social_links", "DELETE", {
      event: "evt-3",
    });
  });

  // MARK: Error Handling

  it("propagates AppError on failure", async () => {
    const { post } = getMocks();
    post.mockRejectedValueOnce(new Error("boom"));
    await expect(
      createEventSocialLinks("evt-err", [
        {
          link: "https://x",
          label: "x",
          order: 0,
        } as unknown as SocialLinkFormData,
      ])
    ).rejects.toBeInstanceOf(AppError);
  });
});
