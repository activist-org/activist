import type { SocialLinkFormData } from "#shared/types/content/social-link";

import { AppError } from "#shared/utils/errorHandler";
// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from "vitest";

import {
  createEventSocialLinks,
  deleteEventSocialLink,
  replaceAllEventSocialLinks,
  updateEventSocialLink,
} from "~/services/event/social-link";

import {
  expectJsonRequest,
  expectRequest,
  setupServiceTestMocks,
} from "../helpers";

describe("services/event/social-link", () => {
  const getMocks = setupServiceTestMocks();

  it("createEventSocialLinks() POSTs each link with event", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValue({ ok: true });
    const links: SocialLinkFormData[] = [
      { link: "https://x", label: "x", order: 0 },
    ] as unknown as SocialLinkFormData[];
    await createEventSocialLinks("evt-1", links);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expectJsonRequest(fetchMock, "/events/event_social_links", "POST", {
      link: "https://x",
      label: "x",
      order: 0,
      event: "evt-1",
    });
  });

  // MARK: Update

  it("updateEventSocialLink() PUTs JSON with event", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({ ok: true });
    await updateEventSocialLink("evt-2", "sl-1", {
      link: "https://z",
      label: "z",
      order: 2,
    });
    expectJsonRequest(fetchMock, "/events/event_social_links/sl-1", "PUT", {
      link: "https://z",
      label: "z",
      order: 2,
      event: "evt-2",
    });
  });

  it("deleteEventSocialLink() issues DELETE", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({ ok: true });
    await deleteEventSocialLink("sl-2");
    expectRequest(fetchMock, "/events/event_social_links/sl-2", "DELETE");
  });

  it("replaceAllEventSocialLinks() DELETEs then recreates", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValue({ ok: true });
    await replaceAllEventSocialLinks("evt-3", [
      { link: "https://a", label: "a", order: 0 },
    ]);
    expectJsonRequest(fetchMock, "/events/event_social_links", "DELETE", {
      event: "evt-3",
    });
  });

  // MARK: Error Handling

  it("propagates AppError on failure", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockRejectedValueOnce(new Error("boom"));
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
