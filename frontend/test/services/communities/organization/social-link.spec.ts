// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from "vitest";

import type { SocialLinkFormData } from "../../../../shared/types/social-link";

import {
  createOrganizationSocialLinks,
  deleteOrganizationSocialLink,
  replaceAllOrganizationSocialLinks,
  updateOrganizationSocialLink,
} from "../../../../app/services/communities/organization/social-link";
import { AppError } from "../../../../shared/utils/errorHandler";
import {
  expectJsonRequest,
  expectRequest,
  setupServiceTestMocks,
} from "../../helpers";

describe("services/communities/organization/social-link", () => {
  const getMocks = setupServiceTestMocks();

  it("createOrganizationSocialLinks() POSTs each link with org", async () => {
    const { post } = getMocks();
    post.mockResolvedValue({ ok: true });
    const links: SocialLinkFormData[] = [
      { link: "https://x", label: "x", order: 0 },
      { link: "https://y", label: "y", order: 1 },
    ] as unknown as SocialLinkFormData[];

    await createOrganizationSocialLinks("org-1", links);

    expect(post).toHaveBeenCalledTimes(2);
    expectJsonRequest(post, "/communities/organization_social_links", "POST", {
      link: "https://x",
      label: "x",
      order: 0,
      org: "org-1",
    });
  });

  // MARK: Update

  it("updateOrganizationSocialLink() PUTs JSON with org", async () => {
    const { put } = getMocks();
    put.mockResolvedValueOnce({ ok: true });
    await updateOrganizationSocialLink("org-2", "sl-1", {
      link: "https://z",
      label: "z",
      order: 2,
    });

    expectJsonRequest(
      put,
      "/communities/organization_social_links/sl-1",
      "PUT",
      {
        link: "https://z",
        label: "z",
        order: 2,
        org: "org-2",
      }
    );
  });

  it("deleteOrganizationSocialLink() issues DELETE", async () => {
    const { del } = getMocks();
    del.mockResolvedValueOnce({ ok: true });
    await deleteOrganizationSocialLink("sl-2");

    expectRequest(del, "/communities/organization_social_links/sl-2", "DELETE");
  });

  it("replaceAllOrganizationSocialLinks() DELETEs then recreates", async () => {
    const { del } = getMocks();
    del.mockResolvedValue({ ok: true });
    await replaceAllOrganizationSocialLinks("org-3", [
      { link: "https://a", label: "a", order: 0 },
    ]);

    // First delete call.
    expectJsonRequest(del, "/communities/organization_social_links", "DELETE", {
      org: "org-3",
    });
  });

  // MARK: Error Handling

  it("propagates AppError on failure", async () => {
    const { post } = getMocks();
    post.mockRejectedValueOnce(new Error("boom"));
    await expect(
      createOrganizationSocialLinks("org-err", [
        {
          link: "https://a",
          label: "a",
          order: 0,
        } as unknown as SocialLinkFormData,
      ])
    ).rejects.toBeInstanceOf(AppError);
  });
});
