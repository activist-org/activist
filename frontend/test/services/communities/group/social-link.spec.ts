// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from "vitest";

import type { SocialLinkFormData } from "../../../../shared/types/social-link";

import {
  createGroupSocialLinks,
  deleteGroupSocialLink,
  replaceAllGroupSocialLinks,
  updateGroupSocialLink,
} from "../../../../app/services/communities/group/social-link";
import { AppError } from "../../../../shared/utils/errorHandler";
import {
  expectJsonRequest,
  expectRequest,
  setupServiceTestMocks,
} from "../../helpers";

describe("services/communities/group/social-link", () => {
  const getMocks = setupServiceTestMocks();

  it("createGroupSocialLinks() POSTs each link with group", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValue({ ok: true });
    const links: SocialLinkFormData[] = [
      { link: "https://x", label: "x", order: 0 },
      { link: "https://y", label: "y", order: 1 },
    ] as unknown as SocialLinkFormData[];

    await createGroupSocialLinks("grp-1", links);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expectJsonRequest(fetchMock, "/communities/group_social_links", "POST", {
      link: "https://x",
      label: "x",
      order: 0,
      group: "grp-1",
    });
  });

  // MARK: Update

  it("updateGroupSocialLink() PUTs JSON", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({ ok: true });
    await updateGroupSocialLink("sl-1", {
      link: "https://z",
      label: "z",
      order: 2,
      group: "grp-2",
    });

    expectJsonRequest(
      fetchMock,
      "/communities/group_social_links/sl-1",
      "PUT",
      {
        link: "https://z",
        label: "z",
        order: 2,
        group: "grp-2",
      }
    );
  });

  it("deleteGroupSocialLink() issues DELETE", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValueOnce({ ok: true });
    await deleteGroupSocialLink("sl-2");

    expectRequest(fetchMock, "/communities/group_social_links/sl-2", "DELETE");
  });

  it("replaceAllGroupSocialLinks() DELETEs then recreates", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockResolvedValue({ ok: true });
    await replaceAllGroupSocialLinks("grp-3", [
      { link: "https://a", label: "a", order: 0 },
    ]);

    expectJsonRequest(fetchMock, "/communities/group_social_links", "DELETE", {
      group: "grp-3",
    });
  });

  // MARK: Error Handling

  it("propagates AppError on failure", async () => {
    const { fetchMock } = getMocks();
    fetchMock.mockRejectedValueOnce(new Error("boom"));
    await expect(
      createGroupSocialLinks("grp-err", [
        {
          link: "https://a",
          label: "a",
          order: 0,
        } as unknown as SocialLinkFormData,
      ])
    ).rejects.toBeInstanceOf(AppError);
  });
});
